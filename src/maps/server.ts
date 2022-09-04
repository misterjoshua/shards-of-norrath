import glob from 'glob';
import path from 'path';
import fs from 'fs';

const MAPS_DIR = path.join(process.cwd(), 'src', 'maps');

export function getMapFileSets(workingDir: string): Record<string, string[]> {
  const files = glob.sync('**/*.txt', {
    cwd: workingDir,
  });

  const groups: Record<string, string[]> = {};
  for (const file of files) {
    // a/b/c/abcd.txt   => a/b/c/abcd
    // a/b/c/abcd_1.txt => a/b/c/abcd
    // a/b/c/abcd_2.txt => a/b/c/abcd
    const [base] = file.split(/(_.*?)?\.txt/);
    const baseLower = base.toLocaleLowerCase();
    groups[baseLower] = groups[baseLower] ?? [];
    groups[baseLower].push(file);
    groups[baseLower].sort((a, b) => {
      if (a.includes('_')) return 1;
      if (b.includes('_')) return -1;
      return a.localeCompare(b);
    });
  }

  return groups;
}

export function getMapList(): MapFileInfo[] {
  return Object.keys(getMapFileSets(MAPS_DIR)).map((fileSet) => ({
    display: fileSet,
    file: fileSet,
  }));
}

export function getMapFile(name: string): MapFile {
  const fileSet = getMapFileSets(MAPS_DIR)[name];

  const items = fileSet.flatMap((file) => parseFile(fs.readFileSync(path.join(MAPS_DIR, file)).toString()));

  return {
    display: name,
    file: name,
    items: items,
  };
}

import { Item, MapFileInfo, MapFile } from './types';

const SCALE = 1;
const parseScaledFloat = (x: string) => parseFloat(x) * SCALE;
const parseScaledInt = (x: string) => parseInt(x) * SCALE;

export function parseLine(line: string): Item | undefined {
  const type = line.substring(0, 1);
  const rest = line.substring(2).split(',');

  switch (type) {
    case 'L':
      return {
        type: 'line',
        from: {
          x: parseScaledFloat(rest[0]),
          y: parseScaledFloat(rest[1]),
          elevation: parseScaledFloat(rest[2]),
        },
        to: {
          x: parseScaledFloat(rest[3]),
          y: parseScaledFloat(rest[4]),
          elevation: parseScaledFloat(rest[5]),
        },
        color: {
          r: parseScaledInt(rest[6]),
          g: parseScaledInt(rest[7]),
          b: parseScaledInt(rest[8]),
        },
      };
    case 'P':
      return {
        type: 'point',
        point: {
          x: parseScaledFloat(rest[0]),
          y: parseScaledFloat(rest[1]),
          elevation: parseScaledFloat(rest[2]),
        },
        color: {
          r: parseScaledInt(rest[3]),
          g: parseScaledInt(rest[4]),
          b: parseScaledInt(rest[5]),
        },
        entityType: rest[6] ?? '?',
        label: rest[7] ?? '?',
      };
  }
}

export function parseFile(file: string): Item[] {
  return file
    .split('\n')
    .map(parseLine)
    .flatMap((item) => (item !== undefined ? [item] : []));
}
