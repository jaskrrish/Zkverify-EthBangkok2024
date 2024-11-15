// src/tests/zkCredentials.test.ts
import "reflect-metadata";
import { TestingAppChain } from "@proto-kit/sdk";
import {
  Credentials,
  CredentialProof,
  credentials as credentialsProgram,
  CredentialPublicOutput,
} from "../../../src/runtime/modules/credentials";
import {
  PrivateKey,
  PublicKey,
  Field,
  MerkleMap,
  Poseidon,
  Bool,
  Signature,
} from "o1js";
import { Balances } from "../../../src/runtime/modules/balances";
import { Balance } from "@proto-kit/library";

describe("ZK Credentials", () => {
  let appChain = TestingAppChain.fromRuntime({
    Credentials,
    Balances,
  });
  let credentials: Credentials;
  let credentialProof: CredentialProof;

  const adminKey = PrivateKey.random();
  const issuerKey = PrivateKey.random();
  const userKey = PrivateKey.random();

  // Setup MerkleMap
  const map = new MerkleMap();
  const key = Poseidon.hash(userKey.toPublicKey().toFields());
  map.set(key, Bool(true).toField());

  const witness = map.getWitness(key);
  const credentialHash = Field(1234); // Example credential hash
  const expirationBlock = Field(1000);

  async function mockProof(): Promise<CredentialProof> {
    console.log("generating mock proof");
    console.time("mockProof");

    const publicOutput = new CredentialPublicOutput({
      root: map.getRoot(),
      credentialHash,
      issuer: issuerKey.toPublicKey(),
      expirationBlock,
    });

    const proof = await CredentialProof.dummy(
      undefined, // public inputs should be undefined for CredentialProof
      publicOutput,
      0 // maxProofsVerified parameter
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
      issuerKey.toPublicKey(),
      expirationBlock
    );
    console.timeEnd("proof");
    return proof;
  }

  beforeAll(async () => {
    // Set admin public key in environment
    process.env.ADMIN_PUBLIC_KEY = adminKey.toPublicKey().toBase58();

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

    // Generate proof - use mock for faster tests
    credentialProof = await mockProof();
    // For real proof testing:
    // credentialProof = await realProof();
  }, 1_000_000);

  it("should setup the credential root", async () => {
    // First register issuer
    appChain.setSigner(adminKey);
    let tx = await appChain.transaction(adminKey.toPublicKey(), () => {
      return credentials.registerIssuer(
        issuerKey.toPublicKey(),
        Signature.create(adminKey, issuerKey.toPublicKey().toFields())
      );
    });

    await tx.sign();
    await tx.send();
    await appChain.produceBlock();

    // Then set credential root
    appChain.setSigner(issuerKey);
    const signature = Signature.create(issuerKey, [map.getRoot()]);
    tx = await appChain.transaction(issuerKey.toPublicKey(), () => {
      return credentials.setCredentialRoot(map.getRoot(), signature);
    });

    await tx.sign();
    await tx.send();

    const block = await appChain.produceBlock();

    const storedRoot =
      await appChain.query.runtime.Credentials.credentialRoot.get();

    expect(block?.transactions[0].status.toBoolean()).toBe(true);
    expect(storedRoot?.toBigInt()).toBe(map.getRoot().toBigInt());
  });

  it("should register issuer correctly", async () => {
    appChain.setSigner(adminKey);
    const tx = await appChain.transaction(adminKey.toPublicKey(), () => {
      return credentials.registerIssuer(
        issuerKey.toPublicKey(),
        Signature.create(adminKey, issuerKey.toPublicKey().toFields())
      );
    });

    await tx.sign();
    await tx.send();

    const block = await appChain.produceBlock();

    const isIssuer = await appChain.query.runtime.Credentials.issuers.get(
      issuerKey.toPublicKey()
    );

    expect(block?.transactions[0].status.toBoolean()).toBe(true);
    expect(isIssuer?.toBoolean()).toBe(true);
  });

  it("should verify valid credential proof", async () => {
    // Setup: Register issuer and set root
    appChain.setSigner(adminKey);
    let tx = await appChain.transaction(adminKey.toPublicKey(), () => {
      return credentials.registerIssuer(
        issuerKey.toPublicKey(),
        Signature.create(adminKey, issuerKey.toPublicKey().toFields())
      );
    });
    await tx.sign();
    await tx.send();
    await appChain.produceBlock();

    appChain.setSigner(issuerKey);
    tx = await appChain.transaction(issuerKey.toPublicKey(), () => {
      return credentials.setCredentialRoot(
        map.getRoot(),
        Signature.create(issuerKey, [map.getRoot()])
      );
    });
    await tx.sign();
    await tx.send();
    await appChain.produceBlock();

    // Verify credential
    appChain.setSigner(userKey);
    tx = await appChain.transaction(userKey.toPublicKey(), () => {
      return credentials.verifyCredential(credentialProof, Field(1));
    });

    await tx.sign();
    await tx.send();

    const block = await appChain.produceBlock();

    const nonceUsed = await appChain.query.runtime.Credentials.usedNonces.get(
      Field(1)
    );

    expect(block?.transactions[0].status.toBoolean()).toBe(true);
    expect(nonceUsed?.toBoolean()).toBe(true);
  });

  it("should prevent reuse of nonces", async () => {
    appChain.setSigner(userKey);
    const tx = await appChain.transaction(userKey.toPublicKey(), () => {
      return credentials.verifyCredential(credentialProof, Field(1));
    });

    await tx.sign();
    await tx.send();

    const block = await appChain.produceBlock();

    expect(block?.transactions[0].status.toBoolean()).toBe(false);
    expect(block?.transactions[0].statusMessage).toMatch(/Nonce already used/);
  });

  it("should handle credential revocation", async () => {
    // Register issuer
    appChain.setSigner(adminKey);
    let tx = await appChain.transaction(adminKey.toPublicKey(), () => {
      return credentials.registerIssuer(
        issuerKey.toPublicKey(),
        Signature.create(adminKey, issuerKey.toPublicKey().toFields())
      );
    });
    await tx.sign();
    await tx.send();
    await appChain.produceBlock();

    // Revoke credential
    appChain.setSigner(issuerKey);
    tx = await appChain.transaction(issuerKey.toPublicKey(), () => {
      return credentials.revokeCredential(
        credentialProof.publicOutput.credentialHash,
        Signature.create(issuerKey, [
          credentialProof.publicOutput.credentialHash,
        ])
      );
    });
    await tx.sign();
    await tx.send();
    await appChain.produceBlock();

    // Try to verify revoked credential
    appChain.setSigner(userKey);
    tx = await appChain.transaction(userKey.toPublicKey(), () => {
      return credentials.verifyCredential(credentialProof, Field(2));
    });
    await tx.sign();
    await tx.send();

    const block = await appChain.produceBlock();

    const isRevoked =
      await appChain.query.runtime.Credentials.revokedCredentials.get(
        credentialProof.publicOutput.credentialHash
      );

    expect(block?.transactions[0].status.toBoolean()).toBe(false);
    expect(block?.transactions[0].statusMessage).toMatch(
      /Credential has been revoked/
    );
    expect(isRevoked?.toBoolean()).toBe(true);
  });
});
