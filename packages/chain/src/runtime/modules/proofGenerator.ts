// src/runtime/modules/proofGenerator.ts
import { credentials, CredentialProof } from './credentials';
import { merkleTreeManager } from './merkleTreeManager';
import { Field, PublicKey } from 'o1js';

export class ProofGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProofGenerationError';
  }
}

export async function generateCredentialProof(
  id: string,
  credentialHash: Field,
  owner: PublicKey,
  expirationBlock: Field,
  verificationHash: Field
): Promise<CredentialProof> {
  try {
    if (!merkleTreeManager.hasCredential(id)) {
      throw new ProofGenerationError('Credential not found in Merkle tree');
    }

    const witness = merkleTreeManager.getWitness(id);

    // Compile the program if needed
    console.log("Compiling credentials program");
    console.time("compile");
    await credentials.compile();
    console.timeEnd("compile");

    // Generate the proof
    console.log("Generating credential proof");
    console.time("proof");
    const proof = await credentials.verifyCredential(
      witness,
      credentialHash,
      owner,
      expirationBlock,
      verificationHash
    );
    console.timeEnd("proof");

    return proof;
  } catch (error) {
    if (error instanceof Error) {
      throw new ProofGenerationError(
        `Failed to generate credential proof: ${error.message}`
      );
    } else {
      throw new ProofGenerationError(
        'Failed to generate credential proof: Unknown error'
      );
    }
  }
}
