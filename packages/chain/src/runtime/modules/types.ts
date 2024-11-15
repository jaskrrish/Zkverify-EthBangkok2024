// src/runtime/modules/types.ts
import { Field, PublicKey, Struct, Bool } from 'o1js';

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
  revoked: Bool,
  version: Field,
  timestamp: Field,
  verificationHash: Field,
  verifiedAt: Field,
}) {
  static fromJSON(json: any): CredentialMetadata {
    if (!json.issuer || !json.expirationBlock || !json.credentialType || !json.verificationHash) {
      throw new Error('Missing required metadata fields');
    }
    return new CredentialMetadata({
      issuer: PublicKey.fromBase58(json.issuer),
      expirationBlock: Field.fromJSON(json.expirationBlock),
      credentialType: Field.fromJSON(json.credentialType),
      revoked: Bool(json.revoked ?? false),
      version: Field.fromJSON(json.version ?? 1),
      timestamp: Field.fromJSON(json.timestamp ?? Date.now()),
      verificationHash: Field.fromJSON(json.verificationHash),
      verifiedAt: Field.fromJSON(json.verifiedAt ?? Date.now()),
    });
  }

  toJSON() {
    return {
      issuer: this.issuer.toBase58(),
      expirationBlock: this.expirationBlock.toString(),
      credentialType: this.credentialType.toString(),
      revoked: this.revoked.toBoolean(),
      version: this.version.toString(),
      timestamp: this.timestamp.toString(),
      verificationHash: this.verificationHash.toString(),
      verifiedAt: this.verifiedAt.toString(),
    };
  }
}
