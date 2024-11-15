// src/runtime/modules/offChainCredentials.ts
import { Field, Poseidon } from 'o1js';
import { CredentialType } from './types';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export interface Credential {
  id: string;
  attributes: Record<string, any>;
  metadata?: {
    expirationBlock: number;
    credentialType: CredentialType;
    version: number;
  };
  verification?: {
    verificationHash: Field;
    verifiedAt: number;
    verifierData?: Record<string, any>;
  };
}

function stringToFields(str: string): Field[] {
  return Array.from(str).map((char) => Field(char.charCodeAt(0)));
}

function convertToField(value: any): Field {
  if (typeof value === 'string') {
    const charFields = stringToFields(value);
    return Poseidon.hash(charFields);
  }
  if (typeof value === 'number') {
    return Field(value);
  }
  if (typeof value === 'boolean') {
    return Field(value ? 1 : 0);
  }
  if (value instanceof Field) {
    return value;
  }
  throw new ValidationError('Unsupported attribute type');
}

export function validateCredential(credential: Credential): void {
  if (!credential.id || typeof credential.id !== 'string') {
    throw new ValidationError('Invalid credential ID');
  }

  if (!credential.attributes || typeof credential.attributes !== 'object') {
    throw new ValidationError('Invalid credential attributes');
  }

  // Validate attributes
  for (const [key, value] of Object.entries(credential.attributes)) {
    try {
      convertToField(value);
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new ValidationError(
        `Invalid attribute value for ${key}: ${errorMessage}`
      );
    }
  }

  // Validate verification data if present
  if (credential.verification) {
    if (!(credential.verification.verificationHash instanceof Field)) {
      throw new ValidationError('Invalid verification hash');
    }
    if (
      typeof credential.verification.verifiedAt !== 'number' ||
      isNaN(credential.verification.verifiedAt)
    ) {
      throw new ValidationError('Invalid verification timestamp');
    }
  }
}

export function hashCredential(credential: Credential): Field {
  validateCredential(credential);

  // Hash ID
  const idFields = stringToFields(credential.id);
  const idHash = Poseidon.hash(idFields);

  // Hash attributes
  const attributeFields = Object.entries(credential.attributes).map(
    ([_, value]) => convertToField(value)
  );

  const fields = [idHash, ...attributeFields];

  // Add metadata if present
  if (credential.metadata) {
    fields.push(
      Field(credential.metadata.expirationBlock),
      Field(credential.metadata.credentialType),
      Field(credential.metadata.version)
    );
  }

  // Add verification data if present
  if (credential.verification) {
    fields.push(
      credential.verification.verificationHash,
      Field(credential.verification.verifiedAt)
    );
  }

  return Poseidon.hash(fields);
}

export function createVerificationHash(
  credentialId: string,
  verifierData: Record<string, any>
): Field {
  const idFields = stringToFields(credentialId);
  const dataFields = Object.entries(verifierData).map(([key, value]) => {
    const keyFields = stringToFields(key);
    const valueField = convertToField(value);
    return Poseidon.hash([...keyFields, valueField]);
  });

  return Poseidon.hash([...idFields, ...dataFields]);
}
