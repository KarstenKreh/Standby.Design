import { it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_COPY = path.join(PACKAGE, '..', '..', '.claude', 'skills', 'design-review', 'SKILL.md');

it('the repo copy of the design-review skill matches the packaged one', { skip: !existsSync(REPO_COPY) }, () => {
  const normalize = (file) => readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  assert.equal(normalize(REPO_COPY), normalize(path.join(PACKAGE, 'skills', 'design-review', 'SKILL.md')));
});
