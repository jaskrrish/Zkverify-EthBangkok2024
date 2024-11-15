"use client";
import "reflect-metadata";

import dynamic from "next/dynamic";

const VerifyCredentialsWrapper = dynamic(
  () => import("@/components/VerifyCredentials"),
  {
    ssr: false,
  },
);

export default function VerifyCredentialsPage() {
  return <VerifyCredentialsWrapper />;
}
