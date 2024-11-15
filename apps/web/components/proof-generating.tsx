import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Lock } from "lucide-react";

export default function GenerateProof() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg bg-white p-8 shadow-lg ring-1 ring-black ring-opacity-5">
          <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Generate Zero-Knowledge Proof
          </h1>

          <div className="mb-8 text-center">
            <Lock className="mx-auto mb-4 h-12 w-12 text-purple-600" />
            <p className="text-lg text-gray-600">
              Our system creates a zero-knowledge proof of your credential,
              allowing you to verify your qualifications without revealing
              sensitive information.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div>
              <Label htmlFor="credentialSelect">Select Credential</Label>
              <Select>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Choose a credential to generate proof" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credential1">
                    Bachelor's Degree in Computer Science
                  </SelectItem>
                  <SelectItem value="credential2">
                    Project Management Certification
                  </SelectItem>
                  <SelectItem value="credential3">
                    Data Science Bootcamp Certificate
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="proofType">Proof Type</Label>
              <Select>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select type of proof" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ownership">Proof of Ownership</SelectItem>
                  <SelectItem value="attributes">
                    Proof of Specific Attributes
                  </SelectItem>
                  <SelectItem value="expiration">
                    Proof of Non-Expiration
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="recipient">Recipient (Optional)</Label>
              <Input
                id="recipient"
                placeholder="Enter recipient's public key or identifier"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="expirationDate">
                Proof Expiration (Optional)
              </Label>
              <Input id="expirationDate" type="date" className="mt-1" />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                Generate Proof
              </Button>
            </div>
          </form>

          <div className="mt-8 rounded-md bg-purple-50 p-4">
            <h2 className="mb-2 flex items-center text-lg font-semibold text-purple-800">
              <Shield className="mr-2 h-5 w-5" />
              How It Works
            </h2>
            <ol className="list-inside list-decimal space-y-2 text-sm text-purple-700">
              <li>Select the credential you want to create a proof for.</li>
              <li>
                Choose the type of proof you need (e.g., proof of ownership,
                specific attributes).
              </li>
              <li>
                Optionally, specify a recipient and expiration date for the
                proof.
              </li>
              <li>
                Our system generates a cryptographic proof of your credential.
              </li>
              <li>
                Share the proof with verifiers without revealing your actual
                credential data.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
