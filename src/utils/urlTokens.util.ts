import crypto, { createHash } from "node:crypto";

export class URLToken {

  public generate(): string {
    return crypto.randomBytes(128).toString('hex');
  };

  public hash(token: string): string {
    return createHash('sha256')
      .update(token)
      .digest('hex');
  };

  public verify(a: string, b: string): boolean {
    const bufA = Buffer.from(a, 'hex');
    const bufB = Buffer.from(b, 'hex');
    return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
  };

};