// src/runtime/modules/credentials.ts
import {
  RuntimeModule,
  runtimeMethod,
  state,
  runtimeModule,
} from "@proto-kit/module";
import { State, StateMap, assert } from "@proto-kit/protocol";
import {
  Bool,
  ZkProgram,
  Field,
  MerkleMapWitness,
  Poseidon,
  Struct,
  PublicKey,
  Signature,
} from "o1js";
import { inject } from "tsyringe";
import { Balances } from "./balances";

// First define the public output structure
export class CredentialPublicOutput extends Struct({
  root: Field,
  credentialHash: Field,
  issuer: PublicKey,
  expirationBlock: Field,
}) {}

// Define the verification function separately
export async function verifyCredential(
  witness: MerkleMapWitness,
  credentialHash: Field,
  issuer: PublicKey,
  expirationBlock: Field
): Promise<CredentialPublicOutput> {
  const key = Poseidon.hash([credentialHash]);
  const [computedRoot, computedKey] = witness.computeRootAndKeyV2(
    Bool(true).toField()
  );
  computedKey.assertEquals(key);

  return new CredentialPublicOutput({
    root: computedRoot,
    credentialHash,
    issuer,
    expirationBlock,
  });
}

// Define the ZK program
export const credentials = ZkProgram({
  name: "credentials",
  publicOutput: CredentialPublicOutput,

  methods: {
    verifyCredential: {
      privateInputs: [MerkleMapWitness, Field, PublicKey, Field],
      method: verifyCredential,
    },
  },
});

export class CredentialProof extends ZkProgram.Proof(credentials) {}

type CredentialsConfig = Record<string, never>;

@runtimeModule()
export class Credentials extends RuntimeModule<CredentialsConfig> {
  @state() public credentialRoot = State.from<Field>(Field);
  @state() public issuers = StateMap.from<PublicKey, Bool>(PublicKey, Bool);
  @state() public usedNonces = StateMap.from<Field, Bool>(Field, Bool);
  @state() public revokedCredentials = StateMap.from<Field, Bool>(Field, Bool);

  public constructor(@inject("Balances") public balances: Balances) {
    super();
  }

  @runtimeMethod()
  public async setCredentialRoot(root: Field, issuerSignature: Signature) {
    const isIssuer = await this.issuers.get(this.transaction.sender.value);
    assert(
      isIssuer.value,
      "Only registered issuers can set the credential root"
    );

    const isValidSignature = issuerSignature.verify(
      this.transaction.sender.value,
      [root]
    );
    assert(isValidSignature, "Invalid issuer signature");

    await this.credentialRoot.set(root);
  }

  @runtimeMethod()
  public async registerIssuer(issuer: PublicKey, adminSignature: Signature) {
    // Using environment variable for admin public key
    const adminPublicKey = PublicKey.fromBase58(process.env.ADMIN_PUBLIC_KEY!);

    const isValidSignature = adminSignature.verify(
      adminPublicKey,
      issuer.toFields()
    );
    assert(isValidSignature, "Invalid admin signature");

    await this.issuers.set(issuer, Bool(true));
  }

  @runtimeMethod()
  public async verifyCredential(proof: CredentialProof, nonce: Field) {
    // Verify the proof
    proof.verify();

    // Check current root matches
    const currentRoot = await this.credentialRoot.get();
    assert(
      proof.publicOutput.root.equals(currentRoot.value),
      "Invalid credential root"
    );

    // Check nonce hasn't been used
    const isNonceUsed = await this.usedNonces.get(nonce);
    assert(isNonceUsed.value.not(), "Nonce already used");

    // Check credential isn't revoked
    const isRevoked = await this.revokedCredentials.get(
      proof.publicOutput.credentialHash
    );
    assert(isRevoked.value.not(), "Credential has been revoked");

    // Check expiration
    const currentBlockHeight = this.network.block.height.toFields()[0];
    assert(
      proof.publicOutput.expirationBlock.greaterThan(currentBlockHeight),
      "Credential has expired"
    );

    // Mark nonce as used
    await this.usedNonces.set(nonce, Bool(true));
  }

  @runtimeMethod()
  public async revokeCredential(
    credentialHash: Field,
    issuerSignature: Signature
  ) {
    const isIssuer = await this.issuers.get(this.transaction.sender.value);
    assert(isIssuer.value, "Only registered issuers can revoke credentials");

    const isValidSignature = issuerSignature.verify(
      this.transaction.sender.value,
      [credentialHash]
    );
    assert(isValidSignature, "Invalid issuer signature");

    await this.revokedCredentials.set(credentialHash, Bool(true));
  }
}
