export abstract class ICryptoService {
  abstract hash(value: string): Promise<string>;
  abstract compare(hash: string, value: string): Promise<boolean>;
}
