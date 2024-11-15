// // src/tests/modules/onChainUpdater.test.ts
import "reflect-metadata";
import { 
  updateOnChainCredential, 
  UpdateError, 
  MAX_RETRIES 
} from '../../../src/runtime/modules/onChainUpdater';
import { merkleTreeManager } from '../../../src/runtime/modules/merkleTreeManager';
import { Credentials } from '../../../src/runtime/modules/credentials';
import { TestingAppChain } from '@proto-kit/sdk';
import { PrivateKey, PublicKey, Field, Bool } from 'o1js';
import { Balances } from '../../../src/runtime/modules/balances';
import { Balance } from '@proto-kit/library';
import { CredentialType, CredentialMetadata } from '../../../src/runtime/modules/types';

describe('OnChainUpdater', () => {
  let appChain = TestingAppChain.fromRuntime({
    Credentials,
    Balances,
  });
  let credentials: Credentials;
  let ownerKey: PrivateKey;

  const credentialHash = Field(1234);
  const verificationHash = Field(5678);
  const expirationBlock = Field(1000);

  beforeAll(async () => {
    ownerKey = PrivateKey.random();

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
  });

  beforeEach(() => {
    merkleTreeManager.reset();
  });

  it('should update credential successfully', async () => {
    const verificationData = {
      credentialHash,
      verificationHash,
      expirationBlock,
      metadata: [
        new CredentialMetadata({
          issuer: ownerKey.toPublicKey(),
          expirationBlock,
          credentialType: Field(CredentialType.IDENTITY),
          revoked: Bool(false),
          version: Field(1),
          timestamp: Field(Date.now()),
          verificationHash,
          verifiedAt: Field(Date.now()),
        }),
      ],
    };

    await updateOnChainCredential(
      ownerKey,
      credentials,
      appChain,
      verificationData
    );

    const isVerified = await appChain.query.runtime.Credentials.verificationStatus.get(
      verificationHash
    );
    expect(isVerified?.toBoolean()).toBe(true);
  });

  it('should retry on temporary failure', async () => {
    let attempts = 0;
    const originalMethod = credentials.createCredential;
    
    // Mock temporary failure
    credentials.createCredential = async (...args) => {
      attempts++;
      if (attempts === 1) {
        throw new Error('Temporary failure');
      }
      return originalMethod.apply(credentials, args);
    };

    try {
      await updateOnChainCredential(
        ownerKey,
        credentials,
        appChain,
        {
          credentialHash,
          verificationHash,
          expirationBlock
        }
      );

      expect(attempts).toBe(2); // First attempt fails, second succeeds
    } finally {
      credentials.createCredential = originalMethod;
    }
  });

  it('should throw after max retries', async () => {
    const originalMethod = credentials.createCredential;
    let attempts = 0;

    // Mock persistent failure
    credentials.createCredential = async () => {
      attempts++;
      throw new Error('Persistent failure');
    };

    try {
      await expect(
        updateOnChainCredential(
          ownerKey,
          credentials,
          appChain,
          {
            credentialHash,
            verificationHash,
            expirationBlock
          }
        )
      ).rejects.toThrow(UpdateError);

      expect(attempts).toBe(MAX_RETRIES);
    } finally {
      credentials.createCredential = originalMethod;
    }
  });

  it('should handle verification status update failure', async () => {
    const originalMethod = credentials.verificationStatus.set;
    credentials.verificationStatus.set = async () => {
      throw new Error('Verification status update failed');
    };

    try {
      await expect(
        updateOnChainCredential(
          ownerKey,
          credentials,
          appChain,
          {
            credentialHash,
            verificationHash,
            expirationBlock
          }
        )
      ).rejects.toThrow(UpdateError);
    } finally {
      credentials.verificationStatus.set = originalMethod;
    }
  });
});
