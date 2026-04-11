import { workerConfig } from '@/uptime.config'
import { MonitorState } from '@/types/config'
import { sanitizePublicError } from '@/util/publicMonitor'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export default async function handler(req: NextRequest): Promise<Response> {
  const { UPTIMEFLARE_STATE } = process.env as unknown as {
    UPTIMEFLARE_STATE: KVNamespace
  }

  const stateStr = await UPTIMEFLARE_STATE?.get('state')
  if (!stateStr) {
    return new Response(JSON.stringify({ error: 'No data available' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  const state = JSON.parse(stateStr) as unknown as MonitorState

  const monitors: Record<
    string,
    { up: boolean; latency: number; location: string; message: string }
  > = {}

  for (const monitor of workerConfig.monitors) {
    const incidents = state.incident[monitor.id] ?? []
    const lastIncident = incidents[incidents.length - 1]
    const lastLatency = state.latency[monitor.id]?.recent?.slice(-1)[0]
    const isUp = lastIncident?.end !== undefined
    const lastError =
      lastIncident && lastIncident.error.length > 0
        ? lastIncident.error[lastIncident.error.length - 1]
        : undefined

    monitors[monitor.id] = {
      up: Boolean(isUp),
      latency: lastLatency?.ping ?? 0,
      location: lastLatency?.loc ?? 'UNKNOWN',
      message: isUp ? 'OK' : sanitizePublicError(lastError),
    }
  }

  const ret = {
    up: state.overallUp,
    down: state.overallDown,
    updatedAt: state.lastUpdate,
    monitors,
  }

  return new Response(JSON.stringify(ret), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
