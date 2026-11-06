import { fileURLToPath } from 'node:url';
import { writeBiomePlugins } from '../src/biome/generate.js';

writeBiomePlugins(fileURLToPath(new URL('../biome/', import.meta.url)));
