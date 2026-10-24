#!/usr/bin/env python3
"""Relit les indices officiels d'indexation des loyers et régénère data/*.json.

Une source par pays, toujours l'institut ou l'administration qui publie l'indice :

  FR  Insee, API BDM (SDMX) : IRL 001515333 (+ variation 001515334), IRL Corse 010760507,
      IRL DOM 010760509 (+ variations 010760508, 010760510), ILC 001532540,
      ILAT 001617112, IPC hors tabac ensemble des ménages France base 2015 001763852
      (arrêtée en déc. 2025) et base 2025 011814056.
      Licence Ouverte 2.0 (Etalab) : https://www.insee.fr/fr/information/2008466
  BE  Statbel, indice santé. Historique 1994 → dernier mois : tableau « indices » (base 2013)
      du calculateur officiel de Bruxelles Logement (https://admin.be.brussels/en/bhg/document/download/7414),
      recoupé chaque mois avec les vues be.STAT de Statbel (13 derniers mois, bases 1996, 2004,
      2013, 2025) : https://bestat.statbel.fgov.be/bestat/api/views/<id>/result/CSV
      Licence Statbel : CC BY 4.0 (open data Statbel).
  ES  INE, API Tempus : IPC general, variación anual (IPC290750, depuis 1993) et IRAV
      (IRAV1, depuis nov. 2024). Réutilisation libre avec citation (aviso legal INE).
  IT  Istat, SDMX esploradati : FOI senza tabacchi (ECOICOP_2 = 00ST), indices et
      variations annuelles, base 2015 (169_748_DF_DCSP_FOI1B2025_2, 1996-2025) et base 2025
      (169_748_DF_DCSP_FOI1B2025_1, depuis janv. 2026). Licence CC BY 4.0 (note legali Istat).
  PT  INE / Diário da República : coefficient annuel (data/pt-coeficientes.json, tenu à la
      main : un chiffre par aviso publié au DR, publié au plus tard le 30 octobre).
  AT  Statistik Austria, OGD : VPI 2020 (OGD_vpi20_VPI_2020_1, 2021-2025) et VPI 2025
      (OGD_vpi25c18_VPI_2025COICOP18_1, depuis janv. 2026). CC BY 4.0.

Usage :
  python3 scripts/update-data.py                 # tout
  python3 scripts/update-data.py --only=fr,es    # quelques pays
  python3 scripts/update-data.py --bootstrap-be <calculateur.xlsx>   # historique BE (openpyxl)

Le script n'écrit un fichier que si la lecture est complète et cohérente (contrôles en fin de
chaque pays) ; sinon il garde l'ancien fichier et sort en erreur (le workflow ne republie pas).
"""
import csv, io, json, os, re, sys, time, urllib.request, datetime as dt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data')
UA = {'User-Agent': 'rent-indexation data refresh (Radif Partners)'}
TODAY = dt.date.today().isoformat()


def get(url, accept=None, timeout=280, tries=3):
    h = dict(UA)
    if accept:
        h['Accept'] = accept
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=h), timeout=timeout) as r:
                return r.read().decode('utf-8-sig')
        except Exception as e:  # réseau, 5xx
            if i == tries - 1:
                raise RuntimeError(f'{url} : {e}')
            time.sleep(5 * (i + 1))


def write(name, obj):
    os.makedirs(DATA, exist_ok=True)
    p = os.path.join(DATA, name)
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print(f'  écrit {os.path.relpath(p, ROOT)}')


def check(cond, msg):
    if not cond:
        raise RuntimeError('contrôle : ' + msg)


# ---------------------------------------------------------------- France (Insee)
INSEE = 'https://api.insee.fr/series/BDM/data/SERIES_BDM/'


def insee_series(idbank):
    x = get(INSEE + idbank, accept='application/xml')
    head = re.search(r'<Series [^>]*>', x).group(0)
    title = re.search(r'TITLE_FR="([^"]*)"', head).group(1)
    last = re.search(r'LAST_UPDATE="([^"]*)"', head).group(1)
    obs = []
    for o in re.findall(r'<Obs [^>]*/>', x):
        a = dict(re.findall(r'(\w+)="([^"]*)"', o))
        if a.get('OBS_VALUE') in (None, '', 'NaN'):
            continue
        obs.append({'p': a['TIME_PERIOD'], 'v': float(a['OBS_VALUE']), 'jo': a.get('DATE_JO')})
    obs.sort(key=lambda r: r['p'])
    return {'idbank': idbank, 'title': title, 'last_update': last,
            'source_url': f'https://www.insee.fr/fr/statistiques/serie/{idbank}', 'obs': obs}


def update_fr():
    irl = insee_series('001515333'); var = insee_series('001515334')
    vmap = {o['p']: o['v'] for o in var['obs']}
    for o in irl['obs']:
        if o['p'] in vmap:
            o['var'] = vmap[o['p']]
    # IRL propres à la Corse et aux DOM (art. 73), créés pendant le plafonnement 2022-2024
    regions = {}
    for k, (i, iv) in {'corse': ('010760507', '010760508'), 'dom': ('010760509', '010760510')}.items():
        s = insee_series(i); sv = {o['p']: o['v'] for o in insee_series(iv)['obs']}
        for o in s['obs']:
            if o['p'] in sv:
                o['var'] = sv[o['p']]
        regions[k] = s
    check(regions['corse']['obs'][-1]['p'] == irl['obs'][-1]['p'], 'IRL Corse en retard')
    ilc = insee_series('001532540'); ilat = insee_series('001617112')
    ipc15 = insee_series('001763852'); ipc25 = insee_series('011814056')
    # Raccordement base 2015 → base 2025 : la base 2025 vaut 100 en moyenne 2025 ; le coefficient
    # est la moyenne 2025 de la série base 2015 / 100 (méthode Insee de raccordement des bases).
    y25 = [o['v'] for o in ipc15['obs'] if o['p'].startswith('2025-')]
    check(len(y25) == 12, 'IPC base 2015 : 12 mois de 2025 attendus')
    coef = round(sum(y25) / 12 / 100, 6)
    check(irl['obs'][-1]['p'] >= '2026-Q3', 'IRL : dernier trimestre attendu ≥ 2026-T3')
    check(130 < irl['obs'][-1]['v'] < 170, 'IRL hors bornes')
    write('fr-indices.json', {
        'retrieved_at': TODAY, 'licence': 'Licence Ouverte 2.0 (Etalab) — Source : Insee',
        'licence_url': 'https://www.insee.fr/fr/information/2008466',
        'irl': irl, 'irl_corse': regions['corse'], 'irl_dom': regions['dom'], 'ilc': ilc, 'ilat': ilat,
        'ipc_hors_tabac': {'base2015': ipc15, 'base2025': ipc25, 'coef_2015_vers_2025': coef,
                           'note': 'série base 2015 arrêtée en décembre 2025 ; base 2025 depuis janvier 2026'},
    })


# ---------------------------------------------------------------- Belgique (Statbel)
BESTAT = 'https://bestat.statbel.fgov.be/bestat/api/views/'
BE_VIEW_BASES = '6fbe6299-8d52-4e31-b4a1-f9793e4116f8'  # indice santé par année de base, 13 derniers mois
MOIS_FR = {m: i + 1 for i, m in enumerate(['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
                                           'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'])}


def bestat_rows(view):
    return list(csv.DictReader(io.StringIO(get(BESTAT + view + '/result/CSV'))))


def update_be():
    p = os.path.join(DATA, 'be-indice-sante.json')
    check(os.path.exists(p), 'historique BE absent : lancer --bootstrap-be <calculateur.xlsx>')
    hist = json.load(open(p, encoding='utf-8'))
    recent = {}
    for r in bestat_rows(BE_VIEW_BASES):
        mois, an = r['Mois'].rsplit(' ', 1)
        per = f'{int(an):04d}-{MOIS_FR[mois]:02d}'
        base = r['Année de base'].split(' ')[0]
        recent.setdefault(per, {})[base] = round(float(r['Indice des prix à la consommation']), 2)
    check(len(recent) >= 12, 'be.STAT : 13 mois attendus')
    b13 = hist['base2013']
    for per, vals in sorted(recent.items()):
        v = vals.get('2013')
        if v is None:
            continue
        if per in b13:
            check(abs(b13[per] - v) < 0.005, f'indice santé {per} : {b13[per]} (historique) ≠ {v} (be.STAT)')
        b13[per] = v
        for base in ('1996', '2004', '2025'):
            if base in vals:
                hist.setdefault('base' + base, {})[per] = vals[base]
    hist['base2013'] = dict(sorted(b13.items()))
    hist['retrieved_at'] = TODAY
    hist['last_period'] = max(hist['base2013'])
    write('be-indice-sante.json', hist)


def bootstrap_be(xlsx):
    import openpyxl  # seulement pour l'amorçage
    ws = openpyxl.load_workbook(xlsx, data_only=True)['indices']
    b13 = {}
    for row in ws.iter_rows(values_only=True):
        cells = [c for c in row]
        yi = next((i for i, c in enumerate(cells) if isinstance(c, int) and 1994 <= c <= 2100), None)
        if yi is None:
            continue
        y = cells[yi]
        for m in range(12):
            v = cells[yi + 1 + m] if yi + 1 + m < len(cells) else None
            if isinstance(v, (int, float)):
                b13[f'{y}-{m + 1:02d}'] = round(float(v), 2)
    check(b13.get('2020-01') == 109.72, 'indice santé janv. 2020 attendu 109,72 (exemple officiel Bruxelles)')
    write('be-indice-sante.json', {
        'retrieved_at': TODAY, 'licence': 'Statbel, CC BY 4.0',
        'history_source': 'Bruxelles Logement, calculateur de loyer indexé (onglet « indices », base 2013), '
                          'https://admin.be.brussels/en/bhg/document/download/7414',
        'monthly_source': BESTAT + BE_VIEW_BASES + '/result/CSV',
        'base2013': dict(sorted(b13.items())), 'last_period': max(b13)})


# ---------------------------------------------------------------- Espagne (INE)
TEMPUS = 'https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/'


def tempus(cod, n=500):
    d = json.loads(get(f'{TEMPUS}{cod}?nult={n}'))
    obs = [{'p': f"{x['Anyo']:04d}-{x['FK_Periodo']:02d}", 'v': x['Valor']} for x in d['Data'] if x['Valor'] is not None]
    return {'cod': cod, 'nombre': d['Nombre'].strip(), 'obs': sorted(obs, key=lambda o: o['p'])}


def update_es():
    ipc = tempus('IPC290750'); irav = tempus('IRAV1', 200)
    check(irav['obs'][0]['p'] == '2024-11', 'IRAV : premier mois attendu nov. 2024')
    check(ipc['obs'][-1]['p'] >= irav['obs'][-1]['p'], 'IPC en retard sur l\'IRAV')
    write('es-indices.json', {
        'retrieved_at': TODAY, 'licence': 'INE — reutilización con cita de la fuente (aviso legal)',
        'licence_url': 'https://www.ine.es/ss/Satellite?L=es_ES&c=Page&cid=1254735849170&p=1254735849170&pagename=Ayuda%2FINELayout',
        'ipc_variacion_anual': ipc, 'irav_variacion_anual': irav})


# ---------------------------------------------------------------- Italie (Istat)
SDMX_IT = 'https://esploradati.istat.it/SDMXWS/rest/data/IT1,'


def istat(flow, start):
    t = get(f'{SDMX_IT}{flow},1.0/M.IT..../?startPeriod={start}',
            accept='application/vnd.sdmx.data+csv;version=1.0.0;labels=id')
    out = {}
    for r in csv.DictReader(io.StringIO(t)):
        if r['ECOICOP_2'] != '00ST' or r['OBS_VALUE'] == '':
            continue
        key = {'4': 'indice', '6': 'var_mese', '7': 'var_anno'}.get(r['MEASURE'])
        if key:
            out.setdefault(r['DATA_TYPE'], {}).setdefault(r['TIME_PERIOD'], {})[key] = float(r['OBS_VALUE'])
    return out


def update_it():
    old = istat('169_748_DF_DCSP_FOI1B2025_2', '1996-01')
    new = istat('169_748_DF_DCSP_FOI1B2025_1', '2026-01')
    check(any('2025-12' in v for v in old.values()), 'FOI base 2015 : déc. 2025 attendu')
    check(any('2026-09' in v for v in new.values()), 'FOI base 2025 : sept. 2026 attendu')
    write('it-foi.json', {
        'retrieved_at': TODAY, 'licence': 'Istat, CC BY 4.0', 'licence_url': 'https://www.istat.it/note-legali/',
        'serie': 'FOI senza tabacchi (ECOICOP_2 = 00ST)',
        'fino_2025': old, 'dal_2026_base2025': new})


# ---------------------------------------------------------------- Autriche (Statistik Austria)
OGD = 'https://data.statistik.gv.at/data/'


def ogd(dataset, code):
    rows = {}
    for r in csv.reader(io.StringIO(get(OGD + dataset + '.csv')), delimiter=';'):
        if len(r) < 3 or r[1] != code:
            continue
        m = re.match(r'VPIZR-(\d{4})(\d{2})?$', r[0])
        if not m:
            continue
        per = f'{m.group(1)}-{m.group(2)}' if m.group(2) else m.group(1)
        rows[per] = float(r[2].replace(',', '.'))
    return rows


def update_at():
    v20 = ogd('OGD_vpi20_VPI_2020_1', 'VPI-0')
    v25 = ogd('OGD_vpi25c18_VPI_2025COICOP18_1', 'VPICOICOP18-0')
    # Bases anciennes pour la Wertsicherung de montants et de contrats antérieurs à 2021.
    v15 = {k: v for k, v in ogd('OGD_vpi15_VPI_2015_1', 'VPI-0').items() if k[:4] <= '2020'}
    v10 = {k: v for k, v in ogd('OGD_vpi10_VPI_2010_1', 'VPI-0').items() if k[:4] <= '2015'}
    check('2020' in v15 and '2015' in v10, 'VPI 2015 / 2010 : moyennes 2020 et 2015 attendues')
    check('2025' in v20 and '2026-01' in v25, 'VPI : moyenne 2025 et janv. 2026 attendues')
    # Statistik Austria poursuit les anciennes bases par chaînage : VPI 2020 (mois 2026) =
    # VPI 2025 × moyenne annuelle 2025 du VPI 2020 / 100. Les moyennes annuelles servent au MieWeG.
    write('at-vpi.json', {
        'retrieved_at': TODAY, 'licence': 'Statistik Austria, CC BY 4.0',
        'vpi2010': v10, 'vpi2015': v15, 'vpi2020': v20, 'vpi2025': v25,
        # Facteur de chaînage = moyenne de l'année de base suivante dans l'ancienne base / 100.
        'verkettung_2010_2015': v10['2015'] / 100, 'verkettung_2015_2020': v15['2020'] / 100,
        'verkettung_2020_2025': v20['2025'] / 100})


def main(argv):
    if len(argv) > 2 and argv[1] == '--bootstrap-be':
        bootstrap_be(argv[2]); return 0
    only = None
    for a in argv[1:]:
        if a.startswith('--only='):
            only = set(a.split('=', 1)[1].split(','))
    jobs = {'fr': update_fr, 'be': update_be, 'es': update_es, 'it': update_it, 'at': update_at}
    failed = []
    for k, f in jobs.items():
        if only and k not in only:
            continue
        print(f'[{k}]')
        try:
            f()
        except Exception as e:
            print(f'  ÉCHEC {k} : {e}', file=sys.stderr); failed.append(k)
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
