"""Prepare isolated synthetic clinical source; originals remain untouched."""
import argparse,shutil
from pathlib import Path
p=argparse.ArgumentParser()
p.add_argument('--simpleslp',type=Path,required=True)
a=p.parse_args()
root=Path(__file__).resolve().parent.parent/'.capture'
clinical=root/'simpleslp'
if clinical.exists():
 raise SystemExit('Clinical capture copy already exists. Reuse it, or choose a new capture workspace before re-seeding.')
shutil.copytree(a.simpleslp,clinical,ignore=shutil.ignore_patterns('.git','.next','node_modules','data','.claude','.env','.env.local','.env.production'))
if (a.simpleslp/'node_modules').exists():
 (clinical/'node_modules').symlink_to((a.simpleslp/'node_modules').resolve(),target_is_directory=True)
print('Prepared isolated capture sources in',root)
print('Seed clinical data with Node 20: node --import tsx scripts/setup.ts (inside .capture/simpleslp)')
