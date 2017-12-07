const EventEmitter = require('eventemitter3')

class Acclimate extends EventEmitter {
  constructor (props) {
    super(props)
    this.cache = {}
  }

  _pushResult (result) {
    this.results.push(result)
  }

  _resetResults () {
    this.results = []
  }

  _wrap (fn) {
    return fn && ((...args) => this._pushResult(fn(...args)))
  }

  new () {
    return new Acclimate()
  }

  get (eventName) {
    return this.cache[eventName]
  }

  emit (eventName, ...args) {
    this._resetResults()
    this.cache[eventName] = args
    super.emit(eventName, ...args)

    return this.results.slice()
  }

  on (eventName, callback) {
    if (this.cache.hasOwnProperty(eventName)) {
      callback(...this.cache[eventName])
    }

    return super.on(eventName, this._wrap(callback))
  }

  once (eventName, callback) {
    if (this.cache.hasOwnProperty(eventName)) {
      callback(...this.cache[eventName])
    }

    return super.once(eventName, this._wrap(callback))
  }

  prependListener (eventName, callback) {
    if (this.cache.hasOwnProperty(eventName)) {
      callback(...this.cache[eventName])
    }

    return super.prependListener(eventName, this._wrap(callback))
  }

  prependOnceListener (eventName, callback) {
    if (this.cache.hasOwnProperty(eventName)) {
      callback(...this.cache[eventName])
    }

    return super.prependOnceListener(eventName, this._wrap(callback))
  }
}

const acclimate = new Acclimate()

module.exports = acclimate