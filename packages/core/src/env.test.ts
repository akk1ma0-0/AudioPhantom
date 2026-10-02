import { describe, expect, it } from 'vitest';
import { loadDevEnv, parseDotenv } from './env.js';

describe('parseDotenv', () => {
  it('parses values, comments, quotes and skips empties', () => {
    expect(parseDotenv('# c\nA=1\nB="two"\nC=\n\nD = x y ')).toEqual({
      A: '1',
      B: 'two',
      D: 'x y',
    });
  });
});

describe('loadDevEnv', () => {
  it('prefers process env and returns only known keys', () => {
    const env = loadDevEnv(undefined, { GROQ_API_KEY: 'g', OTHER: 'x' });
    expect(env).toEqual({ GROQ_API_KEY: 'g' });
  });
});
