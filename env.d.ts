declare global {
  namespace NodeJS {
    interface ProcessEnv {
      UPTIMEFLARE_STATE: KVNamespace
      UPTIMEFLARE_PROXY_TOKEN?: string
    }
  }
}

export {}
