export class ControllerUtil {
  static parseEvent<T>(body: string | null): T {
    return JSON.parse(body ?? JSON.stringify({}))
  }
}
