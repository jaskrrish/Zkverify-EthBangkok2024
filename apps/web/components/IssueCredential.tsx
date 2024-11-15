import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Shield, GraduationCap, CheckCircle } from 'lucide-react'
import { Switch } from "@/components/ui/switch"

export default function IssueCredential() {
  const [isIssued, setIsIssued] = useState(false)

  const handleIssueCredential = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the credential data to your backend
    // and interact with the blockchain to issue the credential
    setIsIssued(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8 ring-1 ring-black ring-opacity-5">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Issue Identity Credential</h1>
          
          <div className="mb-8 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-purple-600 mb-4" />
            <p className="text-lg text-gray-600">
              As an authorized organization, you can issue verifiable identity credentials that users can later use to generate zero-knowledge proofs.
            </p>
          </div>

          <form onSubmit={handleIssueCredential} className="space-y-6">
            <div>
              <Label htmlFor="studentId">Student ID</Label>
              <Input id="studentId" placeholder="Enter student's unique identifier" className="mt-1" required />
            </div>

            <div>
              <Label htmlFor="credentialType">Credential Type</Label>
              <Select required>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select credential type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="degree">Degree</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="transcript">Transcript</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="credentialName">Credential Name</Label>
              <Input id="credentialName" placeholder="e.g., Bachelor of Science in Computer Science" className="mt-1" required />
            </div>

            <div>
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input id="issueDate" type="date" className="mt-1" required />
            </div>

            <div>
              <Label htmlFor="expirationDate">Expiration Date (if applicable)</Label>
              <Input id="expirationDate" type="date" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="additionalDetails">Additional Details</Label>
              <Textarea
                id="additionalDetails"
                placeholder="Enter any additional information about the credential"
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="termsAndConditions" required />
              <Label htmlFor="termsAndConditions">I confirm that this credential information is accurate and I am authorized to issue it.</Label>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                Issue Credential
              </Button>
            </div>
          </form>

          {isIssued && (
            <div className="mt-8 p-4 bg-green-50 rounded-md">
              <h2 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Credential Issued Successfully
              </h2>
              <p className="text-sm text-green-700">
                The credential has been issued and recorded on the blockchain. The student can now use this to generate their zero-knowledge proof.
              </p>
            </div>
          )}

          <div className="mt-8 p-4 bg-purple-50 rounded-md">
            <h2 className="text-lg font-semibold text-purple-800 mb-2 flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Issuing Process
            </h2>
            <ol className="list-decimal list-inside text-sm text-purple-700 space-y-2">
              <li>Enter the student's unique identifier and credential details.</li>
              <li>Verify all information for accuracy.</li>
              <li>Confirm your authority to issue this credential.</li>
              <li>Submit the credential to be recorded on the blockchain.</li>
              <li>The credential is now available for the student to generate zk-proofs.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}