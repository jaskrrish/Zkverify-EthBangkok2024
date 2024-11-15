"use client";
import "reflect-metadata";
import AsyncPageDynamic from "@/containers/async-page-dynamic";
import Header from "@/components/header";
import LandingPage from "@/components/LandingPage";
import { useNotifyTransactions, useWalletStore } from "@/lib/stores/wallet";
import { useClientStore } from "@/lib/stores/client";
import { useChainStore, usePollBlockHeight } from "@/lib/stores/chain";
import { useBalancesStore, useObserveBalance } from "@/lib/stores/balances";
import { useMemo } from "react";

export default function Home() {
  // return <AsyncPageDynamic />;

  const wallet = useWalletStore();
  const client = useClientStore();
  const chain = useChainStore();
  const balances = useBalancesStore();

  usePollBlockHeight();
  useObserveBalance();
  useNotifyTransactions();

  const loading = useMemo(
    () => client.loading || balances.loading,
    [client.loading, balances.loading],
  );

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <LandingPage />
      </div>
    </>
  );
}
