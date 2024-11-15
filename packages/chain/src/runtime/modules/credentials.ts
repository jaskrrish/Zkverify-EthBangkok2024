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
  Field,
  MerkleMapWitness,
  Poseidon,
  ZkProgram,
  Struct,
  PublicKey,
} from "o1js";

export class CredentialPublicOutput extends Struct({
  root: Field,
  credentialHash: Field,
  owner: PublicKey,
  expirationBlock: Field,
  verificationHash: Field, // Added to link with backend verification
}) {}

export const credentials = ZkProgram({
  name: "credentials",
  publicOutput: CredentialPublicOutput,

  methods: {
    verifyCredential: {
      privateInputs: [
        MerkleMapWitness,
        Field,
        PublicKey,
        Field,
        Field, // verificationHash
      ],

      method(
        witness: MerkleMapWitness,
        credentialHash: Field,
        owner: PublicKey,
        expirationBlock: Field,
        verificationHash: Field
      ): Promise<CredentialPublicOutput> {
        const key = Poseidon.hash([credentialHash]);
        const [computedRoot, computedKey] = witness.computeRootAndKeyV2(
          Bool(true).toField()
        );
        computedKey.assertEquals(key);

        return Promise.resolve(
          new CredentialPublicOutput({
            root: computedRoot,
            credentialHash,
            owner,
            expirationBlock,
            verificationHash,
          })
        );
      },
    },
  },
});

export class CredentialProof extends ZkProgram.Proof(credentials) {}

@runtimeModule()
export class Credentials extends RuntimeModule<{}> {
  @state() public credentialRoot = State.from<Field>(Field);
  @state() public usedNonces = StateMap.from<Field, Bool>(Field, Bool);
  @state() public verificationStatus = StateMap.from<Field, Bool>(Field, Bool);

  constructor() {
    super();
  }

  @runtimeMethod()
  public async createCredential(
    credentialHash: Field,
    expirationBlock: Field,
    verificationHash: Field
  ) {
    // Verify the verification hash exists and is valid
    const isVerified = await this.verificationStatus.get(verificationHash);
    assert(isVerified?.value.equals(Bool(true)), "Credential not verified by backend");

    // Update credential root
    await this.credentialRoot.set(credentialHash);
  }

  @runtimeMethod()
  public async verifyCredential(proof: CredentialProof, nonce: Field) {
    // Verify the proof
    proof.verify();

    // Check credential root
    const currentRoot = await this.credentialRoot.get();
    assert(
      proof.publicOutput.root.equals(currentRoot.value),
      "Invalid credential root"
    );

    // Check verification status
    const isVerified = await this.verificationStatus.get(
      proof.publicOutput.verificationHash
    );
    assert(isVerified?.value, "Credential verification invalid");

    // Check nonce hasn't been used
    const isNonceUsed = await this.usedNonces.get(nonce);
    assert(isNonceUsed.value.not(), "Nonce already used");

    // Check expiration
    const currentBlockHeight = this.network.block.height.toFields()[0];
    assert(
      proof.publicOutput.expirationBlock.greaterThan(Field(currentBlockHeight)),
      "Credential expired"
    );

    // Mark nonce as used
    await this.usedNonces.set(nonce, Bool(true));
  }

  @runtimeMethod()
  public async setVerificationStatus(
    verificationHash: Field,
    status: Bool
  ) {
    await this.verificationStatus.set(verificationHash, status);
  }

  @runtimeMethod()
  public async setCredentialRoot(root: Field) {
    await this.credentialRoot.set(root);
  }
}
