export abstract class EmailServiceProtocol {
  abstract sendPasswordResetEmail(
    email: string,
    name: string,
    token: string,
    from: string,
    frontendUrl: string,
  ): Promise<void>;
}
