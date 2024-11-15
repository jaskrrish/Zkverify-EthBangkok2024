// src/runtime/modules/onChainUpdater.ts
import { Field, PrivateKey, Bool } from 'o1js';
import { merkleTreeManager } from './merkleTreeManager';
import { Credentials } from './credentials';
import { CredentialMetadata } from './types';
import { TestingAppChain } from '@proto-kit/sdk';
import { Balances } from './balances';

export const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export class UpdateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UpdateError';
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function updateOnChainCredential(
  issuerPrivateKey: PrivateKey,
  credentialsModule: Credentials,
  appChain = TestingAppChain.fromRuntime({
    Credentials,
    Balances
  }),
  verificationData: {
    credentialHash: Field;
    verificationHash: Field;
    expirationBlock: Field;
    metadata?: CredentialMetadata[];
  },
  retryCount = 0
): Promise<void> {
  try {
    // Set the signer to the issuer
    appChain.setSigner(issuerPrivateKey);

    // Step 1: Update verification status
    const verificationTx = await appChain.transaction(
      issuerPrivateKey.toPublicKey(),
      () => {
        return credentialsModule.setVerificationStatus(
          verificationData.verificationHash,
          Bool(true)
        );
      }
    );

    await verificationTx.sign();
    await verificationTx.send();
    await appChain.produceBlock();

    // Step 2: Create the credential on-chain
    const tx = await appChain.transaction(
      issuerPrivateKey.toPublicKey(),
      () => {
        return credentialsModule.createCredential(
          verificationData.credentialHash,
          verificationData.expirationBlock,
          verificationData.verificationHash
        );
      }
    );

    await tx.sign();
    await tx.send();
    await appChain.produceBlock();
  } catch (error) {
    if (retryCount < MAX_RETRIES - 1) {
      await delay(RETRY_DELAY * Math.pow(2, retryCount));
      return updateOnChainCredential(
        issuerPrivateKey,
        credentialsModule,
        appChain,
        verificationData,
        retryCount + 1
      );
    }
    throw new UpdateError(
      `Failed to update credential: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}
