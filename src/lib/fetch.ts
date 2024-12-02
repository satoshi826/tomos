export class Fetcher {
  constructor(public endpoint: string) {}
  async get({path = ''}) {
    try {
      const response = await fetch(this.endpoint + path)
      if (response.status !== 200) throw new Error(await response.text())
      return response.json()
    } catch (error) {
      throw new Error(error as string)
    }
  }

  async post({body = {}, path = ''}) {
    try {
      const response = await fetch(this.endpoint + path, {
        method : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      if (response.status !== 200) throw new Error(await response.text())
      return response.json()
    } catch (error) {
      throw new Error(error as string)
    }
  }
}
