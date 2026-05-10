// Helper to load Keystatic content in a TanStack Start / Vite environment

export function getCollection(files: Record<string, any>) {
  return Object.values(files).map((file) => file.default || file);
}

export function getSingleton(file: any) {
  return file.default || file;
}
