import { rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const resDir = resolve('android', 'app', 'src', 'main', 'res');

const folders = [
  'drawable-land-ldpi',
  'drawable-land-mdpi',
  'drawable-land-hdpi',
  'drawable-land-xhdpi',
  'drawable-land-xxhdpi',
  'drawable-land-xxxhdpi',
  'drawable-port-ldpi',
  'drawable-port-mdpi',
  'drawable-port-hdpi',
  'drawable-port-xhdpi',
  'drawable-port-xxhdpi',
  'drawable-port-xxxhdpi',
];

for (const folder of folders) {
  rmSync(join(resDir, folder), { recursive: true, force: true });
  console.log(`Removed ${folder}`);
}
