export class Event<T> {
  private handlers: ((data: T) => void)[] = []

  public attach(handler: (data: T) => void): void {
    this.handlers.push(handler)
  }

  public detach(handler: (data: T) => void): void {
    this.handlers = this.handlers.filter(h => h !== handler)
  }

  public emit(data: T): void {
    console.log(data)
    this.handlers.forEach(h => h(data))
  }
}
