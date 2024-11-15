// src/runtime/modules/offChainCredentials.ts
import { Field, Poseidon } from "o1js";
import { CredentialType } from "./types";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
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
}

function stringToFields(str: string): Field[] {
  // Convert string to array of character codes and then to Fields
  return Array.from(str).map((char) => Field(char.charCodeAt(0)));
}

function convertToField(value: any): Field {
  if (typeof value === "string") {
    // Hash the array of character code Fields
    const charFields = stringToFields(value);
    return Poseidon.hash(charFields);
  }
  if (typeof value === "number") {
    return Field(value);
  }
  if (typeof value === "boolean") {
    return Field(value ? 1 : 0);
  }
  if (value instanceof Field) {
    return value;
  }
  throw new ValidationError("Unsupported attribute type");
}

export function validateCredential(credential: Credential): void {
  if (!credential.id || typeof credential.id !== "string") {
    throw new ValidationError("Invalid credential ID");
  }

  if (!credential.attributes || typeof credential.attributes !== "object") {
    throw new ValidationError("Invalid credential attributes");
  }

  // Validate each attribute can be converted to Field
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
}

export function hashCredential(credential: Credential): Field {
  validateCredential(credential);

  // Convert ID string to Fields and hash
  const idFields = stringToFields(credential.id);
  const idHash = Poseidon.hash(idFields);

  // Convert and hash attributes
  const attributeFields = Object.entries(credential.attributes).map(
    ([_, value]) => convertToField(value)
  );

  const fields = [idHash, ...attributeFields];

  if (credential.metadata) {
    fields.push(
      Field(credential.metadata.expirationBlock),
      Field(credential.metadata.credentialType),
      Field(credential.metadata.version)
    );
  }

  return Poseidon.hash(fields);
}
