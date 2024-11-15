// src/runtime/modules/merkleTreeManager.ts
import { Field, MerkleMap, MerkleMapWitness, Poseidon } from 'o1js';

export class MerkleTreeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MerkleTreeError';
  }
}

class MerkleTreeManager {
  private merkleMap: MerkleMap;
  private credentialHashes: Map<string, Field>;
  private verificationHashes: Map<string, Field>;
  private lastUpdateTimestamp: number;

  constructor() {
    this.merkleMap = new MerkleMap();
    this.credentialHashes = new Map();
    this.verificationHashes = new Map();
    this.lastUpdateTimestamp = Date.now();
  }

  private stringToField(str: string): Field {
    // Convert string to array of bytes
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    // Convert bytes to Fields
    const fields = Array.from(bytes).map((byte) => Field(byte));
    // Hash the fields to get a single Field
    return Poseidon.hash(fields);
  }

  public addCredentialHash(
    id: string,
    credentialHash: Field,
    verificationHash: Field
  ): void {
    if (
      !id ||
      !(credentialHash instanceof Field) ||
      !(verificationHash instanceof Field)
    ) {
      throw new MerkleTreeError('Invalid credential data');
    }

    try {
      // Convert string ID to Field using the helper method
      const idField = this.stringToField(id);
      const key = Poseidon.hash([idField]);

      this.merkleMap.set(key, credentialHash);
      this.credentialHashes.set(id, credentialHash);
      this.verificationHashes.set(id, verificationHash);
      this.lastUpdateTimestamp = Date.now();
    } catch (error) {
      throw new MerkleTreeError(
        `Failed to add credential hash: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  public getRoot(): Field {
    return this.merkleMap.getRoot();
  }

  public getWitness(id: string): MerkleMapWitness {
    if (!this.hasCredential(id)) {
      throw new MerkleTreeError('Credential not found');
    }
    const idField = this.stringToField(id);
    const key = Poseidon.hash([idField]);
    return this.merkleMap.getWitness(key);
  }

  public hasCredential(id: string): boolean {
    return this.credentialHashes.has(id);
  }

  public getCredentialHash(id: string): Field {
    const hash = this.credentialHashes.get(id);
    if (!hash) {
      throw new MerkleTreeError('Credential hash not found');
    }
    return hash;
  }

  public getVerificationHash(id: string): Field {
    const hash = this.verificationHashes.get(id);
    if (!hash) {
      throw new MerkleTreeError('Verification hash not found');
    }
    return hash;
  }

  public getLastUpdateTimestamp(): number {
    return this.lastUpdateTimestamp;
  }

  public reset(): void {
    this.merkleMap = new MerkleMap();
    this.credentialHashes.clear();
    this.verificationHashes.clear();
    this.lastUpdateTimestamp = Date.now();
  }
}

export const merkleTreeManager = new MerkleTreeManager();
