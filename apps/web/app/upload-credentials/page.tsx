"use client";
import "reflect-metadata";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const UploadCredentialsWrapper = dynamic(
  () => import("@/components/CredentialsPage"),
  {
    ssr: false,
  },
);

export default function UploadCredentialsPage() {
  const router = useRouter();
  const pathname = usePathname();

  // Check if the current route is /upload-credentials
  if (pathname === "/upload-credentials") {
    return <UploadCredentialsWrapper />;
  }

  // Redirect to the /upload-credentials route if the current route is not /upload-credentials
  router.push("/upload-credentials");
  return null;
}
