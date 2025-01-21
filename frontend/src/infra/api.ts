import { hc } from 'hono/client'
import type { HONO_API } from 'shared/types/api'

const LOCAL_API = 'http://127.0.0.1:8787'

export const client = hc<HONO_API>(LOCAL_API)
