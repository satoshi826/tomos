export class Fetcher {
  constructor(public endpoint: string) {}
  async get({ path = '', query = {} }) {
    try {
      const response = await fetch(`${this.endpoint}${path}?${new URLSearchParams(query).toString()}`)
      if (response.status !== 200) throw new Error(await response.text())
      return response.json()
    } catch (error) {
      throw new Error(error as string)
    }
  }

  async post({ path = '', body = {} }) {
    try {
      const response = await fetch(this.endpoint + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (response.status !== 200) throw new Error(await response.text())
      return response.json()
    } catch (error) {
      throw new Error(error as string)
    }
  }
}

export const fetcher = new Fetcher('http://127.0.0.1:8787')
