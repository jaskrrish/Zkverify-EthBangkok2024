// src/tests/modules/proofGenerator.test.ts
import "reflect-metadata";
import {
  generateCredentialProof,
  ProofGenerationError,
} from "../../../src/runtime/modules/proofGenerator";
import { merkleTreeManager } from "../../../src/runtime/modules/merkleTreeManager";
import {
  credentials,
  CredentialProof,
  CredentialPublicOutput,
} from "../../../src/runtime/modules/credentials";
import { Field, PrivateKey, PublicKey, MerkleMap, Poseidon, Bool } from "o1js";

describe("ProofGenerator", () => {
  const adminKey = PrivateKey.random();
  const issuerKey = PrivateKey.random();
  const userKey = PrivateKey.random();

  // Setup MerkleMap
  const map = new MerkleMap();
  const key = Poseidon.hash(userKey.toPublicKey().toFields());
  map.set(key, Bool(true).toField());

  const witness = map.getWitness(key);
  const credentialHash = Field(1234);
  const expirationBlock = Field(1000);

  // Store original functions
  const originalCompile = credentials.compile;
  const originalVerifyCredential = credentials.verifyCredential;

  async function mockProof(
    hash: Field,
    issuer: PublicKey,
    expBlock: Field
  ): Promise<CredentialProof> {
    const publicOutput = new CredentialPublicOutput({
      root: map.getRoot(),
      credentialHash: hash,
      issuer: issuer,
      expirationBlock: expBlock,
    });

    return await CredentialProof.dummy(undefined, publicOutput, 0);
  }

  beforeAll(async () => {
    // Mock credentials functions
    credentials.compile = async () => {
      return {
        verificationKey: {
          data: "mockData",
          hash: Field(0), // or any appropriate mock Field value
        },
      };
    };
    credentials.verifyCredential = async (witness, hash, issuer, expBlock) => {
      return mockProof(hash, issuer, expBlock);
    };
  });

  afterAll(() => {
    // Restore original functions
    credentials.compile = originalCompile;
    credentials.verifyCredential = originalVerifyCredential;
  });

  beforeEach(() => {
    merkleTreeManager.reset();
  });

  it("should generate proof for valid credential", async () => {
    // Add credential to merkle tree
    merkleTreeManager.addCredentialHash("test-id", credentialHash);

    const proof = await generateCredentialProof(
      "test-id",
      credentialHash,
      issuerKey.toPublicKey(),
      expirationBlock
    );

    expect(proof).toBeDefined();
    expect(proof.publicOutput.credentialHash.toString()).toBe(
      credentialHash.toString()
    );
    expect(proof.publicOutput.issuer.toBase58()).toBe(
      issuerKey.toPublicKey().toBase58()
    );
    expect(proof.publicOutput.expirationBlock.toString()).toBe(
      expirationBlock.toString()
    );
  });

  it("should throw when credential not found", async () => {
    try {
      await generateCredentialProof(
        "non-existent",
        credentialHash,
        issuerKey.toPublicKey(),
        expirationBlock
      );
      throw new Error("Should have thrown ProofGenerationError");
    } catch (error) {
      expect(error instanceof ProofGenerationError).toBe(true);
      expect((error as Error).message).toContain(
        "Credential not found in Merkle tree"
      );
    }
  });

  it("should handle proof generation with different credentials", async () => {
    const testCredentials = [
      { id: "cred1", hash: Field(1) },
      { id: "cred2", hash: Field(2) },
    ];

    for (const cred of testCredentials) {
      merkleTreeManager.addCredentialHash(cred.id, cred.hash);

      const proof = await generateCredentialProof(
        cred.id,
        cred.hash,
        issuerKey.toPublicKey(),
        expirationBlock
      );

      expect(proof.publicOutput.credentialHash.toString()).toBe(
        cred.hash.toString()
      );
    }
  });

  it("should handle metadata correctly", async () => {
    const testId = "test-id";
    merkleTreeManager.addCredentialHash(testId, credentialHash);

    const customExpiration = Field(2000);
    const proof = await generateCredentialProof(
      testId,
      credentialHash,
      issuerKey.toPublicKey(),
      customExpiration
    );

    expect(proof.publicOutput.expirationBlock.toString()).toBe(
      customExpiration.toString()
    );
    expect(proof.publicOutput.issuer.toBase58()).toBe(
      issuerKey.toPublicKey().toBase58()
    );
  });

  it("should handle compilation failure", async () => {
    merkleTreeManager.addCredentialHash("test-id", credentialHash);

    // Mock compilation failure
    credentials.compile = async () => {
      throw new Error("Compilation failed");
    };

    try {
      await generateCredentialProof(
        "test-id",
        credentialHash,
        issuerKey.toPublicKey(),
        expirationBlock
      );
      throw new Error("Should have thrown ProofGenerationError");
    } catch (error) {
      expect(error instanceof ProofGenerationError).toBe(true);
      expect((error as Error).message).toContain("Compilation failed");
    }

    // Restore compile function
    credentials.compile = async () => {
      return {
        verificationKey: {
          data: "mockData",
          hash: Field(0), // or any appropriate mock Field value
        },
      };
    };
  });

  it("should handle proof generation failure", async () => {
    merkleTreeManager.addCredentialHash("test-id", credentialHash);

    // Mock proof generation failure
    const originalVerify = credentials.verifyCredential;
    credentials.verifyCredential = async () => {
      throw new Error("Proof generation failed");
    };

    try {
      await generateCredentialProof(
        "test-id",
        credentialHash,
        issuerKey.toPublicKey(),
        expirationBlock
      );
      throw new Error("Should have thrown ProofGenerationError");
    } catch (error) {
      expect(error instanceof ProofGenerationError).toBe(true);
      expect((error as Error).message).toContain("Proof generation failed");
    }

    // Restore verify function
    credentials.verifyCredential = originalVerify;
  });
});
