
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Mail, Headphones, HelpCircle, Search, Shield, Clock, MessageCircle, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const faqs = [
  {
    id: "submit",
    category: "Submissions",
    question: "How do I submit an anonymous complaint?",
    answer: "To submit an anonymous complaint, click on 'Submit Complaint' in the sidebar, fill out the required fields including category and description, and click submit. Your identity will remain completely confidential throughout the process.",
    icon: "📝"
  },
  {
    id: "track",
    category: "Tracking",
    question: "How can I track the status of my submission?",
    answer: "After submitting a complaint, you'll receive a reference ID. Use the 'Track Issues' section to search for your submission using this ID. You can also browse all public submissions to see their status updates.",
    icon: "📍"
  },
  {
    id: "anonymous",
    category: "Privacy",
    question: "Will my complaint really remain anonymous?",
    answer: "Yes, your complaint will remain completely anonymous unless you explicitly provide contact information for follow-up. We use secure systems and do not track any identifying information about the submitter.",
    icon: "🔒"
  },
  {
    id: "resolution-time",
    category: "Process",
    question: "How long does it take to resolve complaints?",
    answer: "Resolution times vary depending on the complexity and category of the issue. Simple facility issues may be resolved within 1-3 days, while policy-related complaints may take 2-4 weeks. You can track progress in the 'Track Issues' section.",
    icon: "⏱️"
  },
  {
    id: "suggestions",
    category: "Suggestions",
    question: "Can I submit suggestions for improvement?",
    answer: "Absolutely! We encourage positive suggestions through the 'Suggestions' section. You can propose improvements, new services, policy changes, or any ideas that could enhance campus life.",
    icon: "💡"
  },
  {
    id: "issue-types",
    category: "Categories",
    question: "What types of issues can I report?",
    answer: "You can report issues related to Academics, Facilities, Student Discipline, Teachers & Staff, and Clubs & Activities. This includes everything from classroom problems to safety concerns, discrimination, harassment, or any other campus-related issues.",
    icon: "📋"
  },
  {
    id: "access",
    category: "Security",
    question: "Who has access to the submitted complaints?",
    answer: "Only authorized administrators and relevant department heads have access to submitted complaints. All staff with access are trained on confidentiality protocols and are committed to maintaining the anonymity of submissions.",
    icon: "👥"
  }
];

const categories = ["All", "Submissions", "Tracking", "Privacy", "Process", "Suggestions", "Categories", "Security"];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = searchTerm === "" || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-100 dark:from-slate-900 dark:via-purple-900/20 dark:to-blue-900/20" data-testid="faq-page">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 dark:from-purple-400/5 dark:to-blue-400/5"></div>
        <div className="relative page-container py-8 sm:py-12">
          <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
            <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6 shadow-sm">
              <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Help & Support Center
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-purple-800 to-blue-800 dark:from-white dark:via-purple-200 dark:to-blue-300 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Find answers to common questions about our anonymous complaint system and how to use it effectively.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-4xl mx-auto px-4">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-base sm:text-lg font-bold text-foreground">500+</p>
                <p className="text-xs text-muted-foreground">Questions Answered</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="bg-green-100 dark:bg-green-900/30 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-base sm:text-lg font-bold text-foreground">24/7</p>
                <p className="text-xs text-muted-foreground">Support Available</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-base sm:text-lg font-bold text-foreground">98%</p>
                <p className="text-xs text-muted-foreground">Satisfaction Rate</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="bg-amber-100 dark:bg-amber-900/30 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-base sm:text-lg font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Anonymous</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="page-container pb-8 sm:pb-12 -mt-6 sm:-mt-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Search and Filters */}
          <Card className="mb-6 sm:mb-8 border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
                  <Input
                    placeholder="Search for answers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 sm:pl-12 h-10 sm:h-12 border-2 border-muted focus:border-purple-500 dark:focus:border-purple-400 transition-colors rounded-xl text-sm sm:text-base"
                  />
                </div>
                <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="rounded-full text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Accordion */}
          <Card className="mb-8 border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                {selectedCategory === "All" ? "All Questions" : `${selectedCategory} Questions`}
              </CardTitle>
              <p className="text-muted-foreground">
                {filteredFaqs.length} question{filteredFaqs.length !== 1 ? 's' : ''} found
              </p>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-200 dark:from-purple-900 dark:to-blue-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms or category filter.</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem 
                      key={faq.id} 
                      value={faq.id} 
                      data-testid={`faq-${faq.id}`}
                      className="border border-slate-200/50 dark:border-slate-700/50 rounded-xl mb-4 last:mb-0 bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline px-6 py-4 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-t-xl transition-colors">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{faq.icon}</span>
                          <div>
                            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{faq.category}</span>
                            <div>{faq.question}</div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground px-6 pb-4 pt-2 bg-white/30 dark:bg-slate-800/30 rounded-b-xl">
                        <div className="pl-11">
                          {faq.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Headphones className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Still need help?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Can't find the answer you're looking for? Our support team is here to help you 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => window.location.href = 'mailto:support@campus-voice.edu?subject=Support Request'}
                  data-testid="button-contact-support"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 hover:bg-white/50 dark:hover:bg-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Live Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
