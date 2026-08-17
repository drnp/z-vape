import * as migration_20260817_035910 from './20260817_035910';

export const migrations = [
  {
    up: migration_20260817_035910.up,
    down: migration_20260817_035910.down,
    name: '20260817_035910'
  },
];
