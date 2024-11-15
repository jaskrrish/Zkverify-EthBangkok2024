"use client";
import "reflect-metadata";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import GenerateProof from "@/components/proof-generating";

const UploadCredentialsWrapper = dynamic(
  () => import("@/components/proof-generating"),
  {
    ssr: false,
  },
);

export default function UploadCredentialsPage() {
  const router = useRouter();
  const pathname = usePathname();

  // Check if the current route is /upload-credentials
  if (pathname === "/generate-proof") {
    return <GenerateProof />;
  }

  // Redirect to the /upload-credentials route if the current route is not /upload-credentials
  router.push("/generate-proof");
  return null;
}
