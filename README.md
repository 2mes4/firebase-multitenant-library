# Multi-Tenant Firebase Library

## 🤖 Copy this to Generative AI

This library is designed to help manage multi-tenant applications with Firebase, where a single user can belong to multiple companies (tenants).  
Key points for using this library:

- Initialize Firebase once with your Firebase config using `init(config)`.
- Use Firebase Authentication to get the logged-in user.
- Retrieve all companies the user belongs to via `getListOfCompanies()`.
- Let the user select one company, or automatically select if only one exists, and save the selected company ID in `sessionStorage` with `selectCompany(companyId)`.
- Use `getCompany()` to get the currently selected company ID.  
- If the user is not logged in or no company is selected, redirect to `/login`.
- All Firestore data reads and writes should be scoped under the selected company path: `companies/<company_id>/...`

This ensures tenant isolation and a smooth user experience in multi-tenant environments.

---

## 🔧 Installation

```bash
npm install multi-tenant-firebase
````

---

## 🚀 Features

* Initializes Firebase with provided configuration
* Automatically loads companies a user belongs to
* Stores selected company in `sessionStorage`
* Scopes all reads and writes to `companies/<company-id>/...`
* Provides a helper method to retrieve the selected company
* Automatically redirects to `/login` if the user is not authenticated

---

## 📦 Usage

### 1. `init(firebaseConfig: Object): void`

Initializes Firebase with your Firebase project's configuration.
It must be called **once** before using any other function.

```js
import { init } from 'multi-tenant-firebase';

init({
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  ...
});
```

---

### 2. `getListOfCompanies(): Promise<Array<{ id: string, name: string }>>`

Returns a list of companies the currently logged-in user belongs to.

```js
const companies = await getListOfCompanies();
```

> A user is considered to belong to a company if they exist in:
> `companies/<company_id>/users/<user_email>`

---

### 3. `selectCompany(companyId: string): void`

Stores the selected company ID in the browser's `sessionStorage` using key: `company_id`.

```js
selectCompany('company_abc_123');
```

---

### 4. `getCompany(): string`

Returns the currently selected company ID from `sessionStorage`.
If no company is selected, or if the user is not logged in, it **redirects to `/login`**.

```js
const companyId = getCompany(); // -> 'company_abc_123'
```

---

### 🔒 Data Scoping Convention

All user and app data must be scoped under a selected company:

```
companies/<company_id>/users/<user_email>
companies/<company_id>/customers
companies/<company_id>/products
companies/<company_id>/payment-settings
companies/<company_id>/payment-incidents
...
```

with that you can protect your data by using next firestore security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Rule to allow access only to companies where the user is registered
    match /companies/{companyId}/{document=**} {
      
      // Allow read and write if the user exists in /users/<user-email> for this company
      allow read, write: if isUserInCompany(companyId);
    }

    // Function to check if the authenticated user belongs to the company
    function isUserInCompany(companyId) {
      // Check that the user is authenticated
      return request.auth != null
        // Check if the user document exists in the company users collection
        && exists(/databases/$(database)/documents/companies/$(companyId)/users/$(request.auth.token.email));
    }
  }
}

```

This ensures complete data isolation between tenants.

---

## 🧪 Example Flow

1. Call `init(firebaseConfig)`
2. Use Firebase Auth to log the user in
3. Call `getListOfCompanies()`
4. If the user belongs to only one company, auto-select it via `selectCompany(companyId)`
5. If the user belongs to multiple companies, display a selection menu
6. Once selected, store the company via `selectCompany(...)`
7. Use `getCompany()` to access the current tenant ID for all reads/writes

---

## 🧑‍💻 Development

To run tests:

```bash
npm test
```

> Requires Node.js v20+ and Firebase SDK v11+

---

## 📄 License

MIT License.
