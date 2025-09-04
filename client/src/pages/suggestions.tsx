
import SuggestionForm from "@/components/suggestion-form";
import { Lightbulb, Sparkles, Users, TrendingUp, Star, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Suggestions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-100 dark:from-slate-900 dark:via-emerald-900/20 dark:to-green-900/20" data-testid="suggestions-page">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-green-600/10 dark:from-emerald-400/5 dark:to-green-400/5"></div>
        <div className="relative page-container py-8 sm:py-12">
          <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
            <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6 shadow-sm">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Innovation & Positive Change
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-emerald-800 to-green-800 dark:from-white dark:via-emerald-200 dark:to-green-300 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
              Share Your Ideas
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Help us build a better campus community. Your innovative suggestions can create lasting positive change for everyone.
            </p>
          </div>

          {/* Impact Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-4xl mx-auto px-4">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">247</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Ideas Submitted</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">89</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Ideas Implemented</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 sm:col-span-2 md:col-span-1">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">15,000+</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Students Impacted</p>
              </CardContent>
            </Card>
          </div>

          {/* Suggestion Categories */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12 max-w-6xl mx-auto px-4">
            {[
              { icon: "🏫", title: "Campus Facilities", desc: "Improve spaces & infrastructure" },
              { icon: "📚", title: "Academic Services", desc: "Enhance learning experience" },
              { icon: "🎯", title: "Student Activities", desc: "New events & programs" },
              { icon: "💡", title: "Innovation Ideas", desc: "Technology & digital solutions" }
            ].map((category, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{category.icon}</div>
                  <h4 className="font-semibold text-foreground mb-1 text-xs sm:text-sm leading-tight">{category.title}</h4>
                  <p className="text-xs text-muted-foreground hidden sm:block">{category.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="page-container pb-8 sm:pb-12 -mt-6 sm:-mt-8">
        <div className="max-w-3xl mx-auto px-4">
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md hover:shadow-3xl transition-all duration-500">
            <CardContent className="p-6 sm:p-8 md:p-12">
              <div className="flex items-center justify-center mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-emerald-500 to-green-500 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
              
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Submit Your Suggestion</h2>
                <p className="text-sm sm:text-base text-muted-foreground px-2">Every great idea starts with a simple suggestion. Share yours and help shape our community's future.</p>
              </div>

              <SuggestionForm />
            </CardContent>
          </Card>

          {/* Success Stories */}
          <Card className="mt-6 sm:mt-8 border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center mb-3 sm:mb-4">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 mr-2" />
                <h3 className="font-semibold text-foreground text-sm sm:text-base">Recent Success Stories</h3>
              </div>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Extended library hours during finals week - implemented within 2 weeks</p>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">New bike parking stations across campus - 5 locations added</p>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Mobile app for course registration - currently in development</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
