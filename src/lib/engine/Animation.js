
export class Animation {
  constructor({callback, interval = null} = {}) {

    this.callback = callback
    this.interval = interval
    this.unix = 0
    this.delta = 0
    this.drawTime = 0

    const recordTime = () => {
      const nowTime = performance.now()
      this.delta = nowTime - this.unix
      this.unix = nowTime
    }

    const handler = interval
      ? setTimeout
      : requestAnimationFrame

    let tmpTime
    this.animeCallback = () => {
      tmpTime = performance.now()
      recordTime()
      callback({unix: this.unix, delta: this.delta, drawTime: this.drawTime})
      this.drawTime = performance.now() - tmpTime
      handler(this.animeCallback, this.interval)
    }
  }

  start = () => {
    this.animeCallback()
  }
}