/// <reference types="vite/client" />
/// <reference lib="webworker" />

interface ImportMetaEnv {
  // === General === //
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
