#!/usr/bin/env node
import { main, SETUP_ERROR } from '../src/cli.js';

main(process.argv.slice(2)).then(
  (code) => process.exit(code),
  (error) => {
    process.stderr.write(`standby-design-lint: ${error.code === SETUP_ERROR ? error.message : error.stack ?? error}\n`);
    process.exit(process.argv.includes('--hook') ? 1 : 2);
  },
);
