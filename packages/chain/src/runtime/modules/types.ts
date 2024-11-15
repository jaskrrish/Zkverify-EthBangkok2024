import { Field, PublicKey, Struct } from "o1js";

export enum CredentialType {
  IDENTITY = 1,
  ACADEMIC = 2,
  PROFESSIONAL = 3,
  MEMBERSHIP = 4,
}

export class CredentialMetadata extends Struct({
  issuer: PublicKey,
  expirationBlock: Field,
  credentialType: Field,
  revoked: Field,
  version: Field,
  timestamp: Field,
}) {
  static fromJSON(json: any): CredentialMetadata {
    if (!json.issuer || !json.expirationBlock || !json.credentialType) {
      throw new Error("Missing required metadata fields");
    }
    return new CredentialMetadata({
      issuer: PublicKey.fromBase58(json.issuer),
      expirationBlock: Field(json.expirationBlock),
      credentialType: Field(json.credentialType),
      revoked: Field(json.revoked ? 1 : 0),
      version: Field(json.version || 1),
      timestamp: Field(json.timestamp || Date.now()),
    });
  }

  toJSON() {
    return {
      issuer: this.issuer.toBase58(),
      expirationBlock: this.expirationBlock.toString(),
      credentialType: this.credentialType.toString(),
      revoked: this.revoked.equals(Field(1)).toBoolean(),
      version: this.version.toString(),
      timestamp: this.timestamp.toString(),
    };
  }
}
