// src/tests/modules/offChainCredentials.test.ts
import { Field } from 'o1js';
import { 
  Credential,
  validateCredential,
  hashCredential,
  createVerificationHash,
  ValidationError 
} from '../../../src/runtime/modules/offChainCredentials';
import { CredentialType } from '../../../src/runtime/modules/types';

describe('OffChainCredentials', () => {
  const validCredential: Credential = {
    id: 'test-credential',
    attributes: {
      name: 'John Doe',
      age: 30,
      isActive: true,
    },
    metadata: {
      expirationBlock: 1000,
      credentialType: CredentialType.IDENTITY,
      version: 1,
    },
    verification: {
      verificationHash: Field(123),
      verifiedAt: Date.now(),
      verifierData: {
        source: 'test-verifier',
        level: 'high',
      },
    },
  };

  describe('validateCredential', () => {
    it('should validate correct credential', () => {
      expect(() => validateCredential(validCredential)).not.toThrow();
    });

    it('should throw for invalid id', () => {
      const invalidCredential = { ...validCredential, id: '' };
      expect(() => validateCredential(invalidCredential)).toThrow(ValidationError);
    });

    it('should throw for invalid attributes', () => {
      const invalidCredential = {
        ...validCredential,
        attributes: { invalidSymbol: Symbol() },
      };
      expect(() => validateCredential(invalidCredential)).toThrow(ValidationError);
    });

    it('should handle missing metadata', () => {
      const noMetadata = {
        id: validCredential.id,
        attributes: validCredential.attributes,
      };
      expect(() => validateCredential(noMetadata)).not.toThrow();
    });

    it('should validate verification data', () => {
      const invalidVerification = {
        ...validCredential,
        verification: {
          verificationHash: Field(0), // Changed from 'not-a-field' to Field(0)
          verifiedAt: NaN,
        },
      };
      expect(() => validateCredential(invalidVerification)).toThrow(ValidationError);
    });
  });

  describe('hashCredential', () => {
    it('should produce consistent hashes', () => {
      const hash1 = hashCredential(validCredential);
      const hash2 = hashCredential({ ...validCredential });
      expect(hash1.toString()).toBe(hash2.toString());
    });

    it('should produce different hashes for different credentials', () => {
      const hash1 = hashCredential(validCredential);
      const hash2 = hashCredential({
        ...validCredential,
        id: 'different-id'
      });
      expect(hash1.toString()).not.toBe(hash2.toString());
    });

    it('should include metadata in hash', () => {
      const withMetadata = hashCredential(validCredential);
      const withoutMetadata = hashCredential({
        id: validCredential.id,
        attributes: validCredential.attributes
      });
      expect(withMetadata.toString()).not.toBe(withoutMetadata.toString());
    });

    it('should include verification data in hash', () => {
      const withVerification = hashCredential(validCredential);
      const withoutVerification = hashCredential({
        ...validCredential,
        verification: undefined
      });
      expect(withVerification.toString()).not.toBe(withoutVerification.toString());
    });
  });

  describe('createVerificationHash', () => {
    const verifierData = {
      source: 'test-verifier',
      timestamp: Date.now(),
      level: 'high'
    };

    it('should create consistent hashes', () => {
      const hash1 = createVerificationHash('test-id', verifierData);
      const hash2 = createVerificationHash('test-id', { ...verifierData });
      expect(hash1.toString()).toBe(hash2.toString());
    });

    it('should create different hashes for different data', () => {
      const hash1 = createVerificationHash('test-id', verifierData);
      const hash2 = createVerificationHash('test-id', {
        ...verifierData,
        level: 'low'
      });
      expect(hash1.toString()).not.toBe(hash2.toString());
    });

    it('should create different hashes for different ids', () => {
      const hash1 = createVerificationHash('test-id-1', verifierData);
      const hash2 = createVerificationHash('test-id-2', verifierData);
      expect(hash1.toString()).not.toBe(hash2.toString());
    });

    it('should handle various data types', () => {
      const complexData = {
        string: 'test',
        number: 123,
        boolean: true,
        field: Field(456)
      };
      expect(() => createVerificationHash('test-id', complexData))
        .not.toThrow();
    });
  });
});