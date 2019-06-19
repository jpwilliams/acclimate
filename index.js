const EventEmitter = require('eventemitter3')

class Acclimate extends EventEmitter {
  constructor (props) {
    super(props)
    this.cache = {}
    this.fns = new WeakMap()
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

  get (eventName) {
    return this.cache[eventName]
  }

  emit (eventName, ...args) {
    this._resetResults()
    this.cache[eventName] = args
    super.emit(eventName, ...args)

    return this.results
  }

  on (eventName, callback, useCache = true) {
    if (useCache && this.cache.hasOwnProperty(eventName)) {
      callback(...this.cache[eventName])
    }

    this.fns.set(callback, this._wrap(callback))

    return super.on(eventName, this.fns.get(callback))
  }

  once (eventName, callback, useCache = true) {
    if (useCache && this.cache.hasOwnProperty(eventName)) {
      callback(...this.cache[eventName])
    }

    return super.once(eventName, this._wrap(callback))
  }

  prependListener (eventName, callback, useCache = true) {
    if (useCache && this.cache.hasOwnProperty(eventName)) {
      callback(...this.cache[eventName])
    }

    this.fns.set(callback, this._wrap(callback))

    return super.prependListener(eventName, this.fns.get(callback))
  }

  prependOnceListener (eventName, callback, useCache = true) {
    if (useCache && this.cache.hasOwnProperty(eventName)) {
      callback(...this.cache[eventName])
    }

    return super.prependOnceListener(eventName, this._wrap(callback))
  }

  removeListener (eventName, listener) {
    const wrappedFn = this.fns.get(listener)

    if (wrappedFn) {
      return super.removeListener(eventName, wrappedFn)
    }

    return this
  }
}

module.exports = {
  Store: new Acclimate(),
  Acclimate: Acclimate
}
