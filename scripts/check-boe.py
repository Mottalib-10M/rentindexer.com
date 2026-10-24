#!/usr/bin/env python3
"""Veille BOE : le Real Decreto-ley 29/2026 (BOE-A-2026-20823) est-il toujours en vigueur ?

Le plafond de 2 % des loyers espagnols vient de la disposition final sexta du RDL 29/2026, qui
attend sa convalidation par le Congreso. Son jumeau, le RDL 26/2026 (BOE-A-2026-20266), a été
dérogé le 2 octobre 2026 faute de convalidation. Si le RDL 29/2026 tombe à son tour, le calcul
espagnol devient faux : ce contrôle échoue (code 1), donc `update-data.py` aussi, et le workflow
ne republie pas le site tant que le calcul n'est pas corrigé.

Source : API de données ouvertes du BOE, legislación consolidada, métadonnées de la norme
(https://www.boe.es/datosabiertos/), champs `estatus_derogacion`, `estatus_anulacion`,
`vigencia_agotada` (« N » attendu partout).

Usage :
  python3 scripts/check-boe.py            # contrôle ; écrit data/es-boe-rdl29.json avec --write
  python3 scripts/check-boe.py --test     # cas connu bon (RDL 29/2026) et connu mauvais (RDL 26/2026)
Réseau indisponible = échec : le statut ne peut pas être confirmé.
"""
import json, os, sys, time, urllib.request, datetime as dt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API = 'https://www.boe.es/datosabiertos/api/legislacion-consolidada/id/{}/metadatos'
RDL29 = 'BOE-A-2026-20823'
RDL26 = 'BOE-A-2026-20266'  # dérogé le 02/10/2026 : cas connu mauvais
CHAMPS = ('estatus_derogacion', 'estatus_anulacion', 'vigencia_agotada')


def metadatos(ident, tries=3):
    req = urllib.request.Request(API.format(ident), headers={
        'Accept': 'application/json', 'User-Agent': 'rent-indexation BOE watch (Radif Partners)'})
    for i in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                d = json.loads(r.read().decode('utf-8'))
            return d['data'][0]
        except Exception as e:
            if i == tries - 1:
                raise RuntimeError(f'API BOE illisible pour {ident} : {e}')
            time.sleep(3 * (i + 1))


def statut(ident):
    """(en_vigueur, détail) : en vigueur seulement si les trois champs valent « N »."""
    m = metadatos(ident)
    if m.get('identificador') != ident:
        raise RuntimeError(f'API BOE : identifiant inattendu {m.get("identificador")!r}')
    vals = {k: m.get(k, '?') for k in CHAMPS}
    ok = all(v == 'N' for v in vals.values())
    return ok, {'identificador': ident, 'titulo': m.get('titulo', ''), **vals,
                'fecha_derogacion': m.get('fecha_derogacion'), 'fecha_actualizacion': m.get('fecha_actualizacion')}


def verifier(write=False):
    ok, det = statut(RDL29)
    if write:
        with open(os.path.join(ROOT, 'data', 'es-boe-rdl29.json'), 'w', encoding='utf-8') as f:
            json.dump({'checked_at': dt.date.today().isoformat(),
                       'source': 'API datos abiertos BOE, legislacion-consolidada/id/' + RDL29 + '/metadatos (Accept: application/json)',
                       'url_html_consolidada': 'https://www.boe.es/buscar/act.php?id=' + RDL29, **det},
                      f, ensure_ascii=False, indent=1)
            f.write('\n')
    if not ok:
        raise RuntimeError(f'RDL 29/2026 n\'est plus en vigueur selon le BOE ({det}) : corriger le calcul '
                           'espagnol (tope del 2 %) avant de republier')
    return det


def main(argv):
    try:
        if '--test' in argv:
            bon, _ = statut(RDL29)
            mauvais, d26 = statut(RDL26)
            print(f'RDL 29/2026 en vigueur : {bon} (attendu True)')
            print(f'RDL 26/2026 en vigueur : {mauvais} (attendu False, derogación {d26["fecha_derogacion"]})')
            return 0 if (bon and not mauvais) else 1
        det = verifier(write='--write' in argv)
        print(f'BOE : RDL 29/2026 en vigueur (derogación {det["estatus_derogacion"]}, '
              f'anulación {det["estatus_anulacion"]}, vigencia agotada {det["vigencia_agotada"]})')
        return 0
    except Exception as e:
        print(f'ÉCHEC veille BOE : {e}', file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
