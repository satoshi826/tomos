import { type AuthToken, getToken } from './api'

const client_id = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID
const redirect_uri = `${import.meta.env.VITE_API_URL}/auth/callback`
const scope = 'profile'
const access_type = 'offline'
const response_type = 'code'
const prompt = 'consent'

const authUrlBase = 'https://accounts.google.com/o/oauth2/v2/auth'

const generateAuthUrl = async () => {
  const codeChallenge = await generateCodeChallenge()
  const params = new URLSearchParams({
    response_type,
    client_id,
    redirect_uri,
    scope,
    access_type,
    prompt,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })
  return `${authUrlBase}?${params.toString()}`
}

const popupWindow = (url: string, name: string, w: number, h: number) => {
  const wTop = window.screenTop + window.innerHeight / 2 - h / 2
  const wLeft = window.screenLeft + window.innerWidth / 2 - w / 2
  return window.open(url, name, `width=${w}, height=${h}, top=${wTop}, left=${wLeft}, personalbar=0, toolbar=0, scrollbars=1, resizable=!`)
}

const openLoginPopup = async () => {
  const authUrl = await generateAuthUrl()
  return popupWindow(authUrl, 'oauth-popup', 500, 600)
}

export const handleLogin = (callback: (token: AuthToken) => void) => async () => {
  const popup = await openLoginPopup()
  const handlePopupMessage = ({ data }: MessageEvent) => {
    const code = data?.code
    if (code) {
      try {
        console.log('auth_code received')
        window.removeEventListener('message', handlePopupMessage)
        getToken(code).then((res) => callback(res))
      } catch (error) {
        console.error(error)
      } finally {
        popup?.close()
      }
    }
  }
  window.addEventListener('message', handlePopupMessage)
}
export const getStoredCodeVerifier = () => {
  const codeVerifier = sessionStorage.getItem('code_verifier')
  sessionStorage.removeItem('code_verifier')
  return codeVerifier
}
async function generateCodeChallenge() {
  const codeVerifier = generateCodeVerifier()
  sessionStorage.setItem('code_verifier', codeVerifier)
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode(digest)
}

function generateCodeVerifier() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function base64UrlEncode(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}
