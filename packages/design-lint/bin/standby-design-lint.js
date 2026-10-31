#!/usr/bin/env node
import { main } from '../src/cli.js';

main(process.argv.slice(2)).then(
  (code) => process.exit(code),
  (error) => {
    process.stderr.write(`standby-design-lint: ${error.stack ?? error}\n`);
    process.exit(process.argv.includes('--hook') ? 1 : 2);
  },
);
