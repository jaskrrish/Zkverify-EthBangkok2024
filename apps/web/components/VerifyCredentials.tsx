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

export default function OrganizationalLandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-purple-100 to-gray-50 px-4 py-20 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Revolutionize Credential Management for Your Organization
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
              Empower your institution with blockchain-based credential
              verification. Enhance security, streamline processes, and join the
              future of educational technology.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-purple-600 text-lg text-white hover:bg-purple-700"
              >
                Request Demo
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

        {/* Features Section */}
        <section id="features" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              Key Features for Organizations
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 inline-block rounded-full bg-purple-100 p-6">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Secure Blockchain Integration
                </h3>
                <p className="text-gray-600">
                  Leverage blockchain technology to ensure the integrity and
                  immutability of your credentials.
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 inline-block rounded-full bg-purple-100 p-6">
                  <Lock className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Zero-Knowledge Proof Issuance
                </h3>
                <p className="text-gray-600">
                  Issue and verify credentials while maintaining the highest
                  level of privacy for your students.
                </p>
              </div>
              <div className="text-center">
                <div className="mb-4 inline-block rounded-full bg-purple-100 p-6">
                  <Share2 className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Seamless Integration
                </h3>
                <p className="text-gray-600">
                  Easily integrate our platform with your existing systems for
                  smooth credential management.
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
              Benefits for Your Organization
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex items-start space-x-4">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-purple-500" />
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Enhanced Credibility
                  </h3>
                  <p className="text-gray-600">
                    Boost your institution's reputation with cutting-edge,
                    secure credential management.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-purple-500" />
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Operational Efficiency
                  </h3>
                  <p className="text-gray-600">
                    Streamline verification processes and reduce administrative
                    overhead.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-purple-500" />
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Future-Proof Technology
                  </h3>
                  <p className="text-gray-600">
                    Stay ahead of the curve with blockchain and zero-knowledge
                    proof technologies.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-purple-500" />
                <div>
                  <h3 className="mb-2 text-xl font-semibold">
                    Global Recognition
                  </h3>
                  <p className="text-gray-600">
                    Join a network of forward-thinking institutions embracing
                    secure, verifiable credentials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section
          id="case-studies"
          className="bg-white px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              Success Stories
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-lg bg-purple-50 p-6">
                <p className="mb-4 text-gray-600">
                  "Implementing this platform has significantly reduced
                  credential fraud and improved our verification process
                  efficiency by 80%."
                </p>
                <div className="flex items-center">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Dr. Emily Thompson"
                    width={40}
                    height={40}
                    className="mr-3 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">Dr. Emily Thompson</p>
                    <p className="text-sm text-gray-500">
                      Registrar, Global University
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-purple-50 p-6">
                <p className="mb-4 text-gray-600">
                  "Our students love the ability to share verified credentials
                  instantly. It's given our institution a competitive edge in
                  the job market."
                </p>
                <div className="flex items-center">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Prof. Michael Lee"
                    width={40}
                    height={40}
                    className="mr-3 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">Prof. Michael Lee</p>
                    <p className="text-sm text-gray-500">
                      Dean, Tech Institute
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Partners Section */}
        <section className="bg-gray-100 px-4 py-20 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              Integration Partners
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <Image
                  key={i}
                  src={`/placeholder.svg?height=60&width=120&text=Partner${i}`}
                  alt={`Integration Partner ${i}`}
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
              Ready to Transform Your Credential Management?
            </h2>
            <p className="mb-8 text-xl text-purple-100">
              Join leading institutions in creating a secure, efficient, and
              innovative credential ecosystem.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-lg text-purple-600 hover:bg-purple-100"
            >
              Schedule a Demo
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
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400">
                  Integration
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400">
                  Security
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
