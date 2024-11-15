// src/tests/modules/credentials.test.ts
import "reflect-metadata";
import { TestingAppChain } from "@proto-kit/sdk";
import {
  Credentials,
  CredentialProof,
  credentials as credentialsProgram,
  CredentialPublicOutput,
} from "../../../src/runtime/modules/credentials";
import { merkleTreeManager } from "../../../src/runtime/modules/merkleTreeManager";
import {
  PrivateKey,
  PublicKey,
  Field,
  Bool,
  MerkleMap,
  Poseidon,
} from "o1js";
import { Balances } from "../../../src/runtime/modules/balances";
import { Balance } from "@proto-kit/library";
import {
  CredentialType,
  CredentialMetadata,
} from "../../../src/runtime/modules/types";

describe("ZK Credentials", () => {
  let appChain = TestingAppChain.fromRuntime({
    Credentials,
    Balances,
  });
  let credentials: Credentials;
  let credentialProof: CredentialProof;

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

  async function mockProof(): Promise<CredentialProof> {
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

  async function realProof(): Promise<CredentialProof> {
    console.log("compiling credentials program");
    console.time("compile");
    await credentialsProgram.compile();
    console.timeEnd("compile");

    console.log("generating proof");
    console.time("proof");
    const proof = await credentialsProgram.verifyCredential(
      witness,
      credentialHash,
      owner,
      expirationBlock,
      verificationHash
    );
    console.timeEnd("proof");
    return proof;
  }

  beforeAll(async () => {
    appChain = TestingAppChain.fromRuntime({
      Credentials,
      Balances,
    });

    appChain.configurePartial({
      Runtime: {
        Credentials: {},
        Balances: {
          totalSupply: Balance.from(10000),
        },
      },
    });

    await appChain.start();
    credentials = appChain.runtime.resolve("Credentials");
    credentialProof = await mockProof();
  }, 1_000_000);

  it("should create credential with valid verification", async () => {
    appChain.setSigner(ownerKey);

    // Set verification status
    const tx1 = await appChain.transaction(ownerKey.toPublicKey(), () => {
      return credentials.setVerificationStatus(verificationHash, Bool(true));
    });

    await tx1.sign();
    await tx1.send();
    await appChain.produceBlock();

    // Create credential
    appChain.setSigner(ownerKey);
    const tx2 = await appChain.transaction(ownerKey.toPublicKey(), () => {
      return credentials.createCredential(
        credentialHash,
        expirationBlock,
        verificationHash
      );
    });

    await tx2.sign();
    await tx2.send();
    const block = await appChain.produceBlock();

    expect(block?.transactions[0].status.toBoolean()).toBe(true);
  });

  it("should reject unverified credential creation", async () => {
    appChain.setSigner(ownerKey);

    // unverified credential
    const tx1 = await appChain.transaction(ownerKey.toPublicKey(), () => {
      return credentials.setVerificationStatus(verificationHash, Bool(false));
    });
    await tx1.sign();
    await tx1.send();
    await appChain.produceBlock();

    // Create credential
    appChain.setSigner(ownerKey);
    const tx = await appChain.transaction(ownerKey.toPublicKey(), () => {
      return credentials.createCredential(
        credentialHash,
        expirationBlock,
        verificationHash
      );
    });

    await tx.sign();
    await tx.send();
    const block = await appChain.produceBlock();

    expect(block?.transactions[0].status.toBoolean()).toBe(false);
    expect(block?.transactions[0].statusMessage).toMatch(/not verified/);
  });

  it("should verify valid credential proof", async () => {

    appChain.setSigner(ownerKey);

    // Setup verification and root
    const tx1 = await appChain.transaction(ownerKey.toPublicKey(), async () => {
      await credentials.setVerificationStatus(verificationHash, Bool(true));
      await credentials.setCredentialRoot(map.getRoot());
    });

    await tx1.sign();
    await tx1.send();
    await appChain.produceBlock();

    // Verify credential
    appChain.setSigner(ownerKey);
    const tx2 = await appChain.transaction(ownerKey.toPublicKey(), () => {
      return credentials.verifyCredential(credentialProof, Field(1));
    });
    await tx2.sign();
    await tx2.send();
    const block = await appChain.produceBlock();

    const nonceUsed = await appChain.query.runtime.Credentials.usedNonces.get(Field(1));

    expect(block?.transactions[0].status.toBoolean()).toBe(true);
    expect(nonceUsed?.toBoolean()).toBe(true);
  });

  it("should prevent verification with used nonce", async () => {

    appChain.setSigner(ownerKey);

    // Setup and first verification
    const tx1 = await appChain.transaction(ownerKey.toPublicKey(), async () => {
      await credentials.setVerificationStatus(verificationHash, Bool(true));
      await credentials.setCredentialRoot(map.getRoot());
      await credentials.verifyCredential(credentialProof, Field(1));
    });
    await tx1.sign();
    await tx1.send();
    await appChain.produceBlock();

    // Second verification with same nonce
    const tx2 = await appChain.transaction(ownerKey.toPublicKey(), () => {
      return credentials.verifyCredential(credentialProof, Field(1));
    });
    await tx2.sign();
    await tx2.send();
    const block = await appChain.produceBlock();

    expect(block?.transactions[0].status.toBoolean()).toBe(false);
    expect(block?.transactions[0].statusMessage).toMatch(/Credential verification invalid/);
  });

  it("should handle expired credentials", async () => {
    const expiredProof = await CredentialProof.dummy(
      undefined,
      new CredentialPublicOutput({
        root: map.getRoot(),
        credentialHash,
        owner,
        expirationBlock: Field(1), // Expired block
        verificationHash,
      }),
      0
    ) as CredentialProof;

    appChain.setSigner(ownerKey);

    const tx = await appChain.transaction(ownerKey.toPublicKey(), async () => {
      await credentials.setVerificationStatus(verificationHash, Bool(true));
      await credentials.setCredentialRoot(merkleTreeManager.getRoot());
      await credentials.verifyCredential(expiredProof, Field(1));
    });
    await tx.sign();
    await tx.send();
    const block = await appChain.produceBlock();

    expect(block?.transactions[0].status.toBoolean()).toBe(false);
    expect(block?.transactions[0].statusMessage).toMatch(/Credential verification invalid/);
  });
});
