// src/tests/modules/offChainCredentials.test.ts
import {
  Credential,
  validateCredential,
  hashCredential,
  ValidationError,
} from "../../../src/runtime/modules/offChainCredentials";
import { CredentialType } from "../../../src/runtime/modules/types";
import { Field } from "o1js";

describe("OffChainCredentials", () => {
  const validCredential: Credential = {
    id: "test-id",
    attributes: {
      name: "John Doe",
      age: 30,
      isVerified: true,
    },
    metadata: {
      expirationBlock: 1000,
      credentialType: CredentialType.IDENTITY,
      version: 1,
    },
  };

  describe("validateCredential", () => {
    it("should validate correct credential", () => {
      expect(() => validateCredential(validCredential)).not.toThrow();
    });

    it("should throw for invalid id", () => {
      const invalid = { ...validCredential, id: "" };
      expect(() => validateCredential(invalid)).toThrow(ValidationError);
    });

    it("should throw for invalid attributes", () => {
      const invalid = {
        ...validCredential,
        attributes: {
          name: Symbol(), // Invalid attribute type
        },
      };
      expect(() => validateCredential(invalid)).toThrow(ValidationError);
    });

    it("should handle missing metadata", () => {
      const noMetadata = {
        id: validCredential.id,
        attributes: validCredential.attributes,
      };
      expect(() => validateCredential(noMetadata)).not.toThrow();
    });

    it("should handle various attribute types", () => {
      const credential: Credential = {
        id: "test",
        attributes: {
          text: "Hello",
          number: 42,
          boolean: true,
          field: Field(123),
        },
      };
      expect(() => validateCredential(credential)).not.toThrow();
    });
  });

  describe("hashCredential", () => {
    it("should produce consistent hashes", () => {
      const hash1 = hashCredential(validCredential);
      const hash2 = hashCredential({ ...validCredential });
      expect(hash1.toString()).toBe(hash2.toString());
    });

    it("should produce different hashes for different credentials", () => {
      const hash1 = hashCredential(validCredential);
      const hash2 = hashCredential({
        ...validCredential,
        id: "different-id",
      });
      expect(hash1.toString()).not.toBe(hash2.toString());
    });

    it("should include metadata in hash when present", () => {
      const withMetadata = hashCredential(validCredential);
      const withoutMetadata = hashCredential({
        id: validCredential.id,
        attributes: validCredential.attributes,
      });
      expect(withMetadata.toString()).not.toBe(withoutMetadata.toString());
    });
  });
});
