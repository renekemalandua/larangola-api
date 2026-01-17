export abstract class IMailService {
  abstract send(email: string, body?: string, token?: string): Promise<void>;
}
