export type IJwtProps = {
  payload: any;
  secret: string;
  exp: string | number;
};
export abstract class IJwtService {
  abstract encrypt(data: IJwtProps): Promise<string>;
  abstract verify(token: string, secret: string): Promise<string>;
}
