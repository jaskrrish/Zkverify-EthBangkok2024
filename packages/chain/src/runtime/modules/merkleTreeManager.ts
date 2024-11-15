// src/runtime/modules/merkleTreeManager.ts
import { Field, MerkleMap, MerkleMapWitness, Poseidon } from "o1js";

export class MerkleTreeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MerkleTreeError";
  }
}

class MerkleTreeManager {
  private merkleMap: MerkleMap;
  private credentialHashes: Map<string, Field>;
  private lastUpdateTimestamp: number;

  constructor() {
    this.merkleMap = new MerkleMap();
    this.credentialHashes = new Map();
    this.lastUpdateTimestamp = Date.now();
  }

  private hashId(id: string): Field {
    const chunks: Field[] = [];
    for (let i = 0; i < id.length; i++) {
      chunks.push(Field(id.charCodeAt(i)));
    }
    chunks.push(Field(id.length));
    return Poseidon.hash(chunks);
  }

  private validateInputs(id: string, credentialHash: Field): void {
    if (!id || id.trim() === "") {
      throw new MerkleTreeError("Invalid credential ID: ID cannot be empty");
    }

    if (!credentialHash) {
      throw new MerkleTreeError("Invalid credential hash: Hash cannot be null");
    }

    // Convert hash to string and check if it's zero
    const hashValue = credentialHash.toString();
    if (hashValue === "0") {
      throw new MerkleTreeError("Invalid credential hash: Hash cannot be zero");
    }
  }

  public addCredentialHash(id: string, credentialHash: Field): void {
    try {
      this.validateInputs(id, credentialHash);

      const key = this.hashId(id);
      this.merkleMap.set(key, credentialHash);
      this.credentialHashes.set(id, credentialHash);
      this.lastUpdateTimestamp = Date.now();
    } catch (error) {
      if (error instanceof MerkleTreeError) {
        throw error;
      }
      throw new MerkleTreeError(
        `Failed to add credential hash: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  public getRoot(): Field {
    return this.merkleMap.getRoot();
  }

  public getWitness(id: string): MerkleMapWitness {
    if (!this.hasCredential(id)) {
      throw new MerkleTreeError("Credential not found");
    }

    return this.merkleMap.getWitness(this.hashId(id));
  }

  public hasCredential(id: string): boolean {
    return this.credentialHashes.has(id);
  }

  public getCredentialHash(id: string): Field {
    const hash = this.credentialHashes.get(id);
    if (!hash) {
      throw new MerkleTreeError("Credential hash not found");
    }
    return hash;
  }

  public getLastUpdateTimestamp(): number {
    return this.lastUpdateTimestamp;
  }

  public reset(): void {
    this.merkleMap = new MerkleMap();
    this.credentialHashes.clear();
    this.lastUpdateTimestamp = Date.now();
  }
}

export const merkleTreeManager = new MerkleTreeManager();
