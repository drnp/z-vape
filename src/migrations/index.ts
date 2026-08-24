import * as migration_20260817_043805 from './20260817_043805';

export const migrations = [
  {
    up: migration_20260817_043805.up,
    down: migration_20260817_043805.down,
    name: '20260817_043805'
  },
];
