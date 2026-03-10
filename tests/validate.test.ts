import { hashString } from '../src/hasher';

describe('hashString', () => {
  it('produces consistent output for the same input', () => {
    const hash1 = hashString('hello world');
    const hash2 = hashString('hello world');
    expect(hash1).toBe(hash2);
  });

  it('produces different output for different inputs', () => {
    const hash1 = hashString('hello');
    const hash2 = hashString('world');
    expect(hash1).not.toBe(hash2);
  });

  it('returns a 64-character hex string (SHA-256)', () => {
    const hash = hashString('test content');
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
});
