const COMPANY_KEY = 'company_id';

export function getStoredCompanyId() {
  return sessionStorage.getItem(COMPANY_KEY);
}

export function storeCompanyId(companyId) {
  sessionStorage.setItem(COMPANY_KEY, companyId);
}