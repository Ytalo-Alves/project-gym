export interface Encrypter {
  encrypt(payload: {
    sub: string;
    role: string;
    name?: string;
    email?: string;
    avatarUrl?: string;
  }): Promise<string>;
}
