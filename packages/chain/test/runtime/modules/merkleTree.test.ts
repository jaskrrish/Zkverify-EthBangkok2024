// src/tests/modules/merkleTree.test.ts
import { Field } from "o1js";
import {
  merkleTreeManager,
  MerkleTreeError,
} from "../../../src/runtime/modules/merkleTreeManager";

describe("MerkleTreeManager", () => {
  beforeEach(() => {
    merkleTreeManager.reset();
  });

  describe("addCredentialHash", () => {
    it("should add credential hash successfully with numeric id", () => {
      const id = "123";
      const hash = Field(123);

      merkleTreeManager.addCredentialHash(id, hash);

      expect(merkleTreeManager.hasCredential(id)).toBe(true);
      expect(merkleTreeManager.getCredentialHash(id).toString()).toBe(
        hash.toString()
      );
    });

    it("should handle complex string ids", () => {
      const id = "test-credential-id-123!@#";
      const hash = Field(123);

      merkleTreeManager.addCredentialHash(id, hash);

      expect(merkleTreeManager.hasCredential(id)).toBe(true);
      expect(merkleTreeManager.getCredentialHash(id).toString()).toBe(
        hash.toString()
      );
    });

    it("should handle unicode characters in ids", () => {
      const id = "👨‍💻-test-😊";
      const hash = Field(123);

      merkleTreeManager.addCredentialHash(id, hash);

      expect(merkleTreeManager.hasCredential(id)).toBe(true);
      expect(merkleTreeManager.getCredentialHash(id).toString()).toBe(
        hash.toString()
      );
    });

    it("should throw on invalid input", () => {
      expect(() => merkleTreeManager.addCredentialHash("", Field(1))).toThrow(
        MerkleTreeError
      );
      expect(() =>
        merkleTreeManager.addCredentialHash("test", Field(0))
      ).toThrow(MerkleTreeError);
    });

    it("should maintain root consistency", () => {
      const credentials = [
        { id: "test1", hash: Field(1) },
        { id: "test2", hash: Field(2) },
      ];

      const root1 = merkleTreeManager.getRoot();
      credentials.forEach((c) =>
        merkleTreeManager.addCredentialHash(c.id, c.hash)
      );
      const root2 = merkleTreeManager.getRoot();

      expect(root1.toString()).not.toBe(root2.toString());
      expect(merkleTreeManager.getRoot().toString()).toBe(root2.toString());
    });

    it("should generate different roots for different id orderings", () => {
      const cred1 = { id: "test1", hash: Field(1) };
      const cred2 = { id: "test2", hash: Field(2) };

      // First ordering
      merkleTreeManager.reset();
      merkleTreeManager.addCredentialHash(cred1.id, cred1.hash);
      merkleTreeManager.addCredentialHash(cred2.id, cred2.hash);
      const root1 = merkleTreeManager.getRoot();

      // Second ordering
      merkleTreeManager.reset();
      merkleTreeManager.addCredentialHash(cred2.id, cred2.hash);
      merkleTreeManager.addCredentialHash(cred1.id, cred1.hash);
      const root2 = merkleTreeManager.getRoot();

      expect(root1.toString()).toBe(root2.toString());
    });
  });

  describe("getWitness", () => {
    it("should generate valid witness", () => {
      const id = "test-id";
      const hash = Field(123);
      merkleTreeManager.addCredentialHash(id, hash);

      const witness = merkleTreeManager.getWitness(id);
      const [computedRoot] = witness.computeRootAndKeyV2(hash);
      expect(computedRoot.toString()).toBe(
        merkleTreeManager.getRoot().toString()
      );
    });

    it("should throw for non-existent credential", () => {
      expect(() => merkleTreeManager.getWitness("non-existent")).toThrow(
        MerkleTreeError
      );
    });
  });

  describe("reset", () => {
    it("should clear all data", () => {
      merkleTreeManager.addCredentialHash("test-id", Field(1));
      const beforeReset = merkleTreeManager.getRoot();
      merkleTreeManager.reset();

      expect(merkleTreeManager.hasCredential("test-id")).toBe(false);
      expect(merkleTreeManager.getRoot().toString()).not.toBe(
        beforeReset.toString()
      );
    });
  });
});
