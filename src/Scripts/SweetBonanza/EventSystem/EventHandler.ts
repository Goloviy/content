export class EventHandler<T> {
  object: T
  callback: Function
  isEnabled: boolean
  constructor(object: T, callback: Function) {
    this.object = object
    this.callback = callback
    this.isEnabled = true
  }

  call() {
    if (this.isEnabled) this.callback.apply(this.object, arguments)
  }

  equals(object: T, callback: Function) {
    return object == this.object && callback == this.callback
  }
}
