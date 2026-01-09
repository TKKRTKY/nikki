import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';

// Polyfill for structuredClone (required for fake-indexeddb)
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`
