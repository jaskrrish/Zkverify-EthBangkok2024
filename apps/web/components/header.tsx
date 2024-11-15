import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Menu } from "lucide-react";
import Link from "next/link";
// @ts-ignore
import truncateMiddle from "truncate-middle";
import { Chain } from "./chain";
import { Separator } from "@/components/ui/separator";

export interface HeaderProps {
  loading: boolean;
  wallet?: string;
  onConnectWallet: () => void;
  balance?: string;
  balanceLoading: boolean;
  blockHeight?: string;
}

export default function Header({
  loading,
  wallet,
  onConnectWallet,
  balance,
  balanceLoading,
  blockHeight,
}: HeaderProps) {
  return (
    <header className="w-full border-b border-gray-200 bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-8">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">ZKVerify</span>
          </Link>
          <Separator orientation="vertical" className="h-8" />
          <div className="hidden sm:flex">
            <Chain height={blockHeight} />
          </div>
        </div>
        <nav className="hidden space-x-4 md:flex">
          <Link
            href="#how-it-works"
            className="text-gray-600 hover:text-purple-600"
          >
            How It Works
          </Link>
          <Link
            href="#benefits"
            className="text-gray-600 hover:text-purple-600"
          >
            Benefits
          </Link>
          <Link
            href="#testimonials"
            className="text-gray-600 hover:text-purple-600"
          >
            Testimonials
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          {wallet && (
            <div className="hidden flex-col items-end justify-center sm:flex">
              <p className="text-xs text-gray-500">Your balance</p>
              <div className="w-32 pt-0.5 text-right">
                {balanceLoading && balance === undefined ? (
                  <Skeleton className="h-4 w-full" />
                ) : (
                  <p className="text-xs font-bold text-gray-900">
                    {balance} MINA
                  </p>
                )}
              </div>
            </div>
          )}
          <Button
            onClick={onConnectWallet}
            className="w-44 bg-purple-600 text-white hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? (
              <Skeleton className="h-5 w-20" />
            ) : wallet ? (
              truncateMiddle(wallet, 7, 7, "...")
            ) : (
              "Connect Wallet"
            )}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
