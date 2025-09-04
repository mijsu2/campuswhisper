
import ComplaintForm from "@/components/complaint-form";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SubmitComplaint() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" data-testid="submit-complaint-page">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 dark:from-red-400/5 dark:to-orange-400/5"></div>
        <div className="relative page-container py-8 sm:py-12">
          <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
            <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6 shadow-sm">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              100% Anonymous & Confidential
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-red-800 to-orange-800 dark:from-white dark:via-red-200 dark:to-orange-300 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
              Submit Anonymous Complaint
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Your voice matters. Report issues safely and anonymously to help improve our campus community.
            </p>
          </div>

          {/* Security Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-4xl mx-auto px-4">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Fully Anonymous</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">No personal information required or stored</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Secure & Encrypted</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">All submissions are encrypted and protected</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 sm:col-span-2 md:col-span-1">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Trackable Progress</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Get a reference ID to track your submission</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="page-container pb-8 sm:pb-12 -mt-6 sm:-mt-8">
        <div className="max-w-3xl mx-auto px-4">
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md hover:shadow-3xl transition-all duration-500">
            <CardContent className="p-6 sm:p-8 md:p-12">
              <div className="flex items-center justify-center mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
              
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">File Your Complaint</h2>
                <p className="text-sm sm:text-base text-muted-foreground px-2">Provide as much detail as possible to help us address your concerns effectively</p>
              </div>

              <ComplaintForm />
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="mt-6 sm:mt-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Important Information</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li>• Your complaint will be reviewed within 48 hours</li>
                <li>• You'll receive a reference ID to track progress</li>
                <li>• No personal information is collected or stored</li>
                <li>• All submissions are treated with strict confidentiality</li>
                <li className="hidden sm:list-item">• Malicious or false reports may be subject to investigation</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
