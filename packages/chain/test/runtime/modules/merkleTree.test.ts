// src/tests/modules/merkleTree.test.ts
import { Field, Bool } from 'o1js';
import { merkleTreeManager, MerkleTreeError } from '../../../src/runtime/modules/merkleTreeManager';

describe('MerkleTreeManager', () => {
  const testId = 'test-credential';
  const credentialHash = Field(123);
  const verificationHash = Field(456);

  beforeEach(() => {
    merkleTreeManager.reset();
  });

  describe('addCredentialHash', () => {
    it('should add credential hash successfully', () => {
      merkleTreeManager.addCredentialHash(testId, credentialHash, verificationHash);

      expect(merkleTreeManager.hasCredential(testId)).toBe(true);
      expect(merkleTreeManager.getCredentialHash(testId).toString()).toBe(
        credentialHash.toString()
      );
      expect(merkleTreeManager.getVerificationHash(testId).toString()).toBe(
        verificationHash.toString()
      );
    });

    it('should throw for invalid inputs', () => {
      expect(() =>
        merkleTreeManager.addCredentialHash('', credentialHash, verificationHash)
      ).toThrow(MerkleTreeError);

      expect(() =>
        merkleTreeManager.addCredentialHash(testId, null as any, verificationHash)
      ).toThrow(MerkleTreeError);

      expect(() =>
        merkleTreeManager.addCredentialHash(testId, credentialHash, null as any)
      ).toThrow(MerkleTreeError);
    });

    it('should update timestamp on modification', () => {
      const beforeTime = merkleTreeManager.getLastUpdateTimestamp();
      merkleTreeManager.addCredentialHash(testId, credentialHash, verificationHash);
      expect(merkleTreeManager.getLastUpdateTimestamp()).toBeGreaterThan(beforeTime);
    });
  });

  describe('getRoot', () => {
    it('should return consistent root for same data', () => {
      merkleTreeManager.addCredentialHash(testId, credentialHash, verificationHash);
      const root1 = merkleTreeManager.getRoot();

      merkleTreeManager.reset();
      merkleTreeManager.addCredentialHash(testId, credentialHash, verificationHash);
      const root2 = merkleTreeManager.getRoot();

      expect(root1.toString()).toBe(root2.toString());
    });

    it('should return different roots for different data', () => {
      merkleTreeManager.addCredentialHash(testId, credentialHash, verificationHash);
      const root1 = merkleTreeManager.getRoot();

      merkleTreeManager.reset();
      merkleTreeManager.addCredentialHash(testId, Field(999), verificationHash);
      const root2 = merkleTreeManager.getRoot();

      expect(root1.toString()).not.toBe(root2.toString());
    });
  });

  describe('getWitness', () => {
    it('should generate valid witness for existing credential', () => {
      merkleTreeManager.addCredentialHash(testId, credentialHash, verificationHash);
      const witness = merkleTreeManager.getWitness(testId);
      const [computedRoot] = witness.computeRootAndKeyV2(credentialHash);
      expect(computedRoot.toString()).toBe(merkleTreeManager.getRoot().toString());
    });

    it('should throw for non-existent credential', () => {
      expect(() => 
        merkleTreeManager.getWitness('non-existent')
      ).toThrow(MerkleTreeError);
    });
  });

  describe('hash management', () => {
    it('should correctly store and retrieve credential hash', () => {
      merkleTreeManager.addCredentialHash(testId, credentialHash, verificationHash);
      expect(merkleTreeManager.getCredentialHash(testId).toString())
        .toBe(credentialHash.toString());
    });

    it('should correctly store and retrieve verification hash', () => {
      merkleTreeManager.addCredentialHash(testId, credentialHash, verificationHash);
      expect(merkleTreeManager.getVerificationHash(testId).toString())
        .toBe(verificationHash.toString());
    });

    it('should throw when retrieving non-existent hashes', () => {
      expect(() => 
        merkleTreeManager.getCredentialHash('non-existent')
      ).toThrow(MerkleTreeError);

      expect(() => 
        merkleTreeManager.getVerificationHash('non-existent')
      ).toThrow(MerkleTreeError);
    });
  });

  describe('reset', () => {
    it('should clear all stored data', () => {
      merkleTreeManager.addCredentialHash(testId, credentialHash, verificationHash);
      expect(merkleTreeManager.hasCredential(testId)).toBe(true);

      merkleTreeManager.reset();
      expect(merkleTreeManager.hasCredential(testId)).toBe(false);
      expect(() => merkleTreeManager.getCredentialHash(testId))
        .toThrow(MerkleTreeError);
      expect(() => merkleTreeManager.getVerificationHash(testId))
        .toThrow(MerkleTreeError);
    });

    it('should update timestamp on reset', () => {
      const beforeTime = merkleTreeManager.getLastUpdateTimestamp();
      merkleTreeManager.reset();
      expect(merkleTreeManager.getLastUpdateTimestamp()).toBeGreaterThan(beforeTime);
    });
  });
});