// src/runtime/modules/onChainUpdater.ts
import { Field, PrivateKey, Signature } from "o1js";
import { merkleTreeManager } from "./merkleTreeManager";
import { Credentials } from "./credentials";
import { CredentialMetadata } from "./types";
import { TestingAppChain } from "@proto-kit/sdk";
import { Balances } from "./balances";

export const MAX_RETRIES = 3; // Made constant exportable for testing
const RETRY_DELAY = 1000;

export class UpdateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UpdateError";
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function updateOnChainCredentialRoot(
  issuerPrivateKey: PrivateKey,
  credentialsModule: Credentials,
  appChain = TestingAppChain.fromRuntime({
    Credentials,
    Balances,
  }),
  metadata: CredentialMetadata[] = [],
  retryCount = 0
): Promise<void> {
  try {
    const newRoot = merkleTreeManager.getRoot();
    const issuerSignature = Signature.create(issuerPrivateKey, [newRoot]);

    appChain.setSigner(issuerPrivateKey);
    const tx = await appChain.transaction(
      issuerPrivateKey.toPublicKey(),
      () => {
        return credentialsModule.setCredentialRoot(newRoot, issuerSignature);
      }
    );

    await tx.sign();
    await tx.send();
    await appChain.produceBlock();
  } catch (error) {
    if (retryCount < MAX_RETRIES - 1) {
      await delay(RETRY_DELAY * Math.pow(2, retryCount));
      return updateOnChainCredentialRoot(
        issuerPrivateKey,
        credentialsModule,
        appChain,
        metadata,
        retryCount + 1
      );
    }
    throw new UpdateError(
      `Failed to update credential root: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
