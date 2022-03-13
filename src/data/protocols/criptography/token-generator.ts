export interface TokenGenerator {
  generate: (payload: string) => Promise<string>
}
