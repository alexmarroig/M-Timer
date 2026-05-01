const Module = require('node:module');

if (!global.__MTIMER_ASYNC_STORAGE_MOCK__) {
  const storage = new Map();
  const originalLoad = Module._load;

  const asyncStorageMock = {
    getItem: async (key) => (storage.has(key) ? storage.get(key) : null),
    setItem: async (key, value) => {
      storage.set(key, value);
    },
    removeItem: async (key) => {
      storage.delete(key);
    },
    clear: async () => {
      storage.clear();
    },
  };

  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === '@react-native-async-storage/async-storage') {
      return {
        __esModule: true,
        default: asyncStorageMock,
        ...asyncStorageMock,
      };
    }

    return originalLoad.call(this, request, parent, isMain);
  };

  global.__MTIMER_ASYNC_STORAGE_MOCK__ = asyncStorageMock;
}

module.exports = global.__MTIMER_ASYNC_STORAGE_MOCK__;
