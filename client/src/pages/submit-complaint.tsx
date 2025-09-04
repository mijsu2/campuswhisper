
import ComplaintForm from "@/components/complaint-form";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SubmitComplaint() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" data-testid="submit-complaint-page">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 dark:from-red-400/5 dark:to-orange-400/5"></div>
        <div className="relative page-container py-12">
          <div className="text-center max-w-4xl mx-auto mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-700 dark:text-red-300 text-sm font-medium mb-6 shadow-sm">
              <Shield className="w-4 h-4 mr-2" />
              100% Anonymous & Confidential
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-red-800 to-orange-800 dark:from-white dark:via-red-200 dark:to-orange-300 bg-clip-text text-transparent mb-4">
              Submit Anonymous Complaint
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your voice matters. Report issues safely and anonymously to help improve our campus community.
            </p>
          </div>

          {/* Security Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Fully Anonymous</h3>
                <p className="text-sm text-muted-foreground">No personal information required or stored</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Secure & Encrypted</h3>
                <p className="text-sm text-muted-foreground">All submissions are encrypted and protected</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Trackable Progress</h3>
                <p className="text-sm text-muted-foreground">Get a reference ID to track your submission</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="page-container pb-12 -mt-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md hover:shadow-3xl transition-all duration-500">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center justify-center mb-8">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">File Your Complaint</h2>
                <p className="text-muted-foreground">Provide as much detail as possible to help us address your concerns effectively</p>
              </div>

              <ComplaintForm />
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="mt-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-3">Important Information</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Your complaint will be reviewed within 48 hours</li>
                <li>• You'll receive a reference ID to track progress</li>
                <li>• No personal information is collected or stored</li>
                <li>• All submissions are treated with strict confidentiality</li>
                <li>• Malicious or false reports may be subject to investigation</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
