// src/tests/modules/proofGenerator.test.ts
import { 
  generateCredentialProof,
  ProofGenerationError 
} from '../../../src/runtime/modules/proofGenerator';

import { merkleTreeManager } from '../../../src/runtime/modules/merkleTreeManager';
import { credentials, CredentialProof, CredentialPublicOutput } from '../../../src/runtime/modules/credentials';
import { Field, PrivateKey, PublicKey, MerkleMap, Poseidon, Bool } from 'o1js';

describe('ProofGenerator', () => {
  const ownerKey = PrivateKey.random();
  const owner = ownerKey.toPublicKey();
  const credentialId = "test-credential";
  const credentialHash = Field(1234);
  const expirationBlock = Field(1000);
  const verificationHash = Field(5678);

  // Setup Merkle Map
  const map = new MerkleMap();
  const key = Poseidon.hash(ownerKey.toPublicKey().toFields());
  map.set(key, Bool(true).toField());

  const witness = map.getWitness(key);

  const originalCompile = credentials.compile;
  const originalVerifyCredential = credentials.verifyCredential;

  async function mockProof(
    credentialHash: Field,
    owner: PublicKey,
    expirationBlock: Field,
    verificationHash: Field
  ): Promise<CredentialProof> {
    console.log("generating mock proof");
    console.time("mockProof");
    
    const publicOutput = new CredentialPublicOutput({
      root: map.getRoot(),
      credentialHash,
      owner,
      expirationBlock,
      verificationHash,
    });

    const proof = await CredentialProof.dummy(
      undefined, // public inputs should be undefined for CredentialProof
      publicOutput,
      0  // maxProofsVerified parameter
    );
    console.timeEnd("mockProof");
    return proof as CredentialProof; // Add type assertion
  }

  beforeAll(async () => {
    credentials.compile = async () => {
      return {
        verificationKey: {
          data: 'mockData',
          hash: Field(0),
        },
      };
    };
    credentials.verifyCredential = async (witness, hash, owner, expirationBlock, verificationHash) => {
      return await mockProof(hash, owner, expirationBlock, verificationHash);
    }
  });

  afterAll(() => {
    credentials.compile = originalCompile;
    credentials.verifyCredential = originalVerifyCredential;
  });

  beforeEach(() => {
    merkleTreeManager.reset();
  });


  it('should generate proof for valid credential', async () => {
    merkleTreeManager.addCredentialHash(credentialId, credentialHash, verificationHash);

    const proof = await generateCredentialProof(
      credentialId,
      credentialHash,
      owner,
      expirationBlock,
      verificationHash
    );

    expect(proof).toBeDefined();
    expect(proof.publicOutput.credentialHash.toString()).toBe(credentialHash.toString());
    expect(proof.publicOutput.owner.toBase58()).toBe(owner.toBase58());
    expect(proof.publicOutput.expirationBlock.toString()).toBe(expirationBlock.toString());
    expect(proof.publicOutput.verificationHash.toString()).toBe(verificationHash.toString());
  });

  it('should throw when credential not found', async () => {
    await expect(
      generateCredentialProof(
        'non-existent',// This should be undefined
        credentialHash,
        owner,
        expirationBlock,
        verificationHash
      )
    ).rejects.toThrow(ProofGenerationError);
  });

  it('should handle compilation failure', async () => {
    merkleTreeManager.addCredentialHash(credentialId, credentialHash, verificationHash);
    
    const originalCompile = credentials.compile;
    credentials.compile = async () => {
      throw new Error('Compilation failed');
    };

    try {
      await expect(
        generateCredentialProof(
          credentialId,
          credentialHash,
          owner,
          expirationBlock,
          verificationHash
        )
      ).rejects.toThrow(ProofGenerationError);
    } finally {
      credentials.compile = originalCompile;
    }
  });

  it('should handle proof generation failure', async () => {
    merkleTreeManager.addCredentialHash(credentialId, credentialHash, verificationHash);
    
    const originalVerifyCredential = credentials.verifyCredential;
    credentials.verifyCredential = async () => {
      throw new Error('Proof generation failed');
    };

    try {
      await expect(
        generateCredentialProof(
          credentialId,
          credentialHash,
          owner,
          expirationBlock,
          verificationHash
        )
      ).rejects.toThrow(ProofGenerationError);
    } finally {
      credentials.verifyCredential = originalVerifyCredential;
    }
  });

  it('should handle unknown errors', async () => {
    merkleTreeManager.addCredentialHash(credentialId, credentialHash, verificationHash);
    
    const originalVerifyCredential = credentials.verifyCredential;
    credentials.verifyCredential = async () => {
      throw null;
    };

    try {
      await expect(
        generateCredentialProof(
          credentialId,
          credentialHash,
          owner,
          expirationBlock,
          verificationHash
        )
      ).rejects.toThrow('Failed to generate credential proof: Unknown error');
    } finally {
      credentials.verifyCredential = originalVerifyCredential;
    }
  });

  it('should verify generated proof', async () => {
    merkleTreeManager.addCredentialHash(credentialId, credentialHash, verificationHash);

    const proof = await generateCredentialProof(
      credentialId,
      credentialHash,
      owner,
      expirationBlock,
      verificationHash
    );

    // The proof should verify without throwing
    expect(() => proof.verify()).not.toThrow();
  });
});