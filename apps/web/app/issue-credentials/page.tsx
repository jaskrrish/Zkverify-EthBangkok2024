"use client";
import "reflect-metadata";

import dynamic from "next/dynamic";

const IssueCredentialWrapper = dynamic(
  () => import("@/components/IssueCredential"),
  {
    ssr: false,
  },
);

export default function IssueCredentialPage() {
  return <IssueCredentialWrapper />;
}
