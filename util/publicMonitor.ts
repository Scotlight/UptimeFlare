import { MonitorState } from '../types/config'

const PUBLIC_ERROR_DEFAULT = 'Check failed'

export function sanitizePublicError(error: string | null | undefined): string {
  const normalized = (error ?? '').trim().toLowerCase()

  if (!normalized) return PUBLIC_ERROR_DEFAULT
  if (normalized.includes('timeout')) return 'Request timed out'
  if (normalized.includes('tls certificate not trusted')) return 'TLS validation failed'
  if (normalized.includes('certificate')) return 'TLS validation failed'
  if (normalized.includes('expected codes')) return 'Unexpected HTTP status'
  if (normalized.includes("http response doesn't contain")) return 'Response validation failed'
  if (normalized.includes('http response contains the configured forbidden keyword')) {
    return 'Response validation failed'
  }
  if (normalized.includes('globalping error')) return 'Remote probe failed'
  if (normalized.includes('dns')) return 'DNS resolution failed'
  if (normalized.includes('enotfound')) return 'DNS resolution failed'
  if (normalized.includes('econnrefused')) return 'Connection refused'
  if (normalized.includes('connection refused')) return 'Connection refused'
  if (normalized.includes('network is unreachable')) return 'Network unreachable'
  if (normalized.includes('proxy')) return 'Remote probe failed'

  return PUBLIC_ERROR_DEFAULT
}

export function sanitizePublicState(state: MonitorState): MonitorState {
  return {
    ...state,
    incident: Object.fromEntries(
      Object.entries(state.incident).map(([monitorId, incidents]) => [
        monitorId,
        incidents.map((incident) => ({
          ...incident,
          error: incident.error.map((value) => sanitizePublicError(value)),
        })),
      ])
    ),
  }
}
