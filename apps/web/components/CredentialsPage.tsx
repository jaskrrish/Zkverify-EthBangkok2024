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
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

export default function CredentialsPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg bg-white p-8 shadow-lg ring-1 ring-black ring-opacity-5">
          <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Upload Your Credentials
          </h1>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div>
              <Label htmlFor="credentialType">Credential Type</Label>
              <Select>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select credential type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="degree">Degree</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="license">License</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="issuer">Issuing Institution</Label>
              <Input
                id="issuer"
                placeholder="Enter the name of the issuing institution"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="dateIssued">Date Issued</Label>
              <Input id="dateIssued" type="date" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="credentialName">Credential Name</Label>
              <Input
                id="credentialName"
                placeholder="e.g., Bachelor of Science in Computer Science"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Provide any additional details about your credential"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="file">Upload Credential File</Label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 hover:text-purple-500"
                    >
                      <span>Upload a file</span>
                      <Input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                Submit Credential
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
