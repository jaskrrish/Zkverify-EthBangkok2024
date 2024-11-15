// src/tests/modules/onChainUpdater.test.ts
import "reflect-metadata";
import {
  updateOnChainCredentialRoot,
  UpdateError,
  MAX_RETRIES,
} from "../../../src/runtime/modules/onChainUpdater";
import { merkleTreeManager } from "../../../src/runtime/modules/merkleTreeManager";
import { Credentials } from "../../../src/runtime/modules/credentials";
import { TestingAppChain } from "@proto-kit/sdk";
import { PrivateKey, PublicKey, Field, Signature } from "o1js";
import { Balances } from "../../../src/runtime/modules/balances";
import { Balance } from "@proto-kit/library";

describe("OnChainUpdater", () => {
  let appChain = TestingAppChain.fromRuntime({
    Credentials,
    Balances,
  });
  let credentials: Credentials;
  let issuerKey: PrivateKey;
  let adminKey: PrivateKey;

  beforeAll(async () => {
    adminKey = PrivateKey.random();
    issuerKey = PrivateKey.random();
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
  });

  beforeEach(async () => {
    merkleTreeManager.reset();

    // Register issuer before each test
    appChain.setSigner(adminKey);
    const tx = await appChain.transaction(adminKey.toPublicKey(), () => {
      return credentials.registerIssuer(
        issuerKey.toPublicKey(),
        Signature.create(adminKey, issuerKey.toPublicKey().toFields())
      );
    });
    await tx.sign();
    await tx.send();
    await appChain.produceBlock();
  });

  //   afterEach(async () => {
  //     await appChain.stop();
  //   });

  it("should update root successfully", async () => {
    merkleTreeManager.addCredentialHash("test", Field(123));

    await updateOnChainCredentialRoot(issuerKey, credentials, appChain);

    const storedRoot =
      await appChain.query.runtime.Credentials.credentialRoot.get();
    expect(storedRoot?.toBigInt()).toBe(merkleTreeManager.getRoot().toBigInt());
  });

  // it('should retry on failure', async () => {
  //   let attempts = 0;
  //   const originalMethod = credentials.setCredentialRoot;

  //   try {
  //     // Mock the setCredentialRoot method
  //     credentials.setCredentialRoot = async (...args) => {
  //       attempts++;
  //       if (attempts <= 2) { // Fail first two attempts
  //         throw new Error('Temporary failure');
  //       }
  //       return originalMethod.apply(credentials, args);
  //     };

  //     merkleTreeManager.addCredentialHash('test', Field(123));
  //     await updateOnChainCredentialRoot(issuerKey, credentials, appChain);

  //     expect(attempts).toBe(3); // First two fail, third succeeds
  //   } finally {
  //     // Ensure original method is restored
  //     credentials.setCredentialRoot = originalMethod;
  //   }
  // });

  it("should throw after max retries", async () => {
    let attempts = 0;
    const originalMethod = credentials.setCredentialRoot;

    try {
      // Mock the setCredentialRoot method to always fail
      credentials.setCredentialRoot = async () => {
        attempts++;
        throw new Error("Persistent failure");
      };

      merkleTreeManager.addCredentialHash("test", Field(123));

      await expect(
        updateOnChainCredentialRoot(issuerKey, credentials, appChain)
      ).rejects.toThrow(UpdateError);

      expect(attempts).toBe(MAX_RETRIES); // Should attempt exactly MAX_RETRIES times
    } finally {
      // Ensure original method is restored
      credentials.setCredentialRoot = originalMethod;
    }
  });
});
