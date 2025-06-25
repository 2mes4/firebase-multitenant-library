import { storeCompanyId, getStoredCompanyId } from '../src/storage.js';

describe('Storage Tests', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('storeCompanyId y getStoredCompanyId funcionan correctamente', () => {
    storeCompanyId('abc123');
    expect(getStoredCompanyId()).toBe('abc123');
  });
});