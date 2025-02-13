import { injectable } from 'inversify'

type styles = 'default' | 'success' | 'error'

@injectable()
class LoggerService {
  private readonly styles: { [k in styles]: string } = {
    default: 'color: #808080; border: 1px solid #808080; padding: 3px',
    success: 'color: #0ec80e; font-weight: bold',
    error: 'color: #E46962; border: 1px solid #E46962; padding: 3px',
  }

  log(message: string, style: styles = 'default'): void {
    console.log(`%c${message}`, this.styles[style])
  }
}

export { LoggerService }
