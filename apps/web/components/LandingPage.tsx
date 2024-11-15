import { Button } from "@/components/ui/button";
import {
  Shield,
  Upload,
  Share2,
  Lock,
  CheckCircle,
  GraduationCap,
  Building,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-purple-100 to-gray-50 px-4 py-20 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Secure Credential Verification with Zero-Knowledge Proofs
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
              Empower universities and students with blockchain-based credential
              verification. Protect privacy, ensure authenticity, and streamline
              the verification process.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-purple-600 text-lg text-white hover:bg-purple-700"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-600 text-lg text-purple-600 hover:bg-purple-50"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="bg-white px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              How It Works
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 inline-block rounded-full bg-purple-100 p-6">
                  <Building className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Universities On-Chain
                </h3>
                <p className="text-gray-600">
                  Universities add their details to the blockchain, creating a
                  trusted network of credential issuers.
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 inline-block rounded-full bg-purple-100 p-6">
                  <Lock className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Generate ZK Proof
                </h3>
                <p className="text-gray-600">
                  Students create zero-knowledge proofs of their credentials,
                  ensuring privacy and security.
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 inline-block rounded-full bg-purple-100 p-6">
                  <UserCheck className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Verify On-Chain</h3>
                <p className="text-gray-600">
                  Instantly verify credentials on-chain without revealing
                  sensitive information.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section
          id="benefits"
          className="bg-gray-100 px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              Benefits of Our Platform
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex items-start space-x-4">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-purple-500" />
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Enhanced Privacy
                  </h3>
                  <p className="text-gray-600">
                    Zero-knowledge proofs allow credential verification without
                    exposing sensitive data.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-purple-500" />
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Immutable Records
                  </h3>
                  <p className="text-gray-600">
                    Blockchain technology ensures that credential records cannot
                    be tampered with or forged.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-purple-500" />
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Instant Verification
                  </h3>
                  <p className="text-gray-600">
                    On-chain verification provides quick and reliable
                    confirmation of credentials.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-purple-500" />
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Empowered Institutions
                  </h3>
                  <p className="text-gray-600">
                    Universities can easily manage and issue verifiable
                    credentials on the blockchain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="bg-white px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              What Our Users Say
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-lg bg-purple-50 p-6">
                <p className="mb-4 text-gray-600">
                  "This platform has revolutionized how we issue and verify
                  student credentials. It's secure, efficient, and respects
                  privacy."
                </p>
                <div className="flex items-center">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Dr. Sarah Johnson"
                    width={40}
                    height={40}
                    className="mr-3 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">Dr. Sarah Johnson</p>
                    <p className="text-sm text-gray-500">
                      Dean of Admissions, Tech University
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-purple-50 p-6">
                <p className="mb-4 text-gray-600">
                  "As a recent graduate, I love how easy it is to share my
                  verified credentials without compromising my personal data.
                  It's the future of credential verification!"
                </p>
                <div className="flex items-center">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Alex Chen"
                    width={40}
                    height={40}
                    className="mr-3 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">Alex Chen</p>
                    <p className="text-sm text-gray-500">
                      Recent Graduate, Computer Science
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="bg-gray-100 px-4 py-20 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              Trusted by Leading Institutions
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <Image
                  key={i}
                  src={`/placeholder.svg?height=60&width=120&text=University${i}`}
                  alt={`University ${i}`}
                  width={120}
                  height={60}
                  className="grayscale transition-all duration-300 hover:grayscale-0"
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-purple-600 px-4 py-20 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Ready to Revolutionize Credential Verification?
            </h2>
            <p className="mb-8 text-xl text-purple-100">
              Join universities and students in creating a secure, private, and
              efficient credential ecosystem.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-lg text-purple-600 hover:bg-purple-100"
            >
              Get Started Now
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="container mx-auto grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-purple-400">
                  For Universities
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400">
                  For Students
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-purple-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-purple-400">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-purple-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-8 border-t border-gray-800 pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} ZKVerify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
