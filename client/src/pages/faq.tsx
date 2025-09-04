import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Mail, Headphones } from "lucide-react";

const faqs = [
  {
    id: "submit",
    question: "How do I submit an anonymous complaint?",
    answer: "To submit an anonymous complaint, click on 'Submit Complaint' in the sidebar, fill out the required fields including category and description, and click submit. Your identity will remain completely confidential throughout the process."
  },
  {
    id: "track",
    question: "How can I track the status of my submission?",
    answer: "After submitting a complaint, you'll receive a reference ID. Use the 'Track Issues' section to search for your submission using this ID. You can also browse all public submissions to see their status updates."
  },
  {
    id: "anonymous",
    question: "Will my complaint really remain anonymous?",
    answer: "Yes, your complaint will remain completely anonymous unless you explicitly provide contact information for follow-up. We use secure systems and do not track any identifying information about the submitter."
  },
  {
    id: "resolution-time",
    question: "How long does it take to resolve complaints?",
    answer: "Resolution times vary depending on the complexity and category of the issue. Simple facility issues may be resolved within 1-3 days, while policy-related complaints may take 2-4 weeks. You can track progress in the 'Track Issues' section."
  },
  {
    id: "suggestions",
    question: "Can I submit suggestions for improvement?",
    answer: "Absolutely! We encourage positive suggestions through the 'Suggestions' section. You can propose improvements, new services, policy changes, or any ideas that could enhance campus life."
  },
  {
    id: "issue-types",
    question: "What types of issues can I report?",
    answer: "You can report issues related to Academics, Facilities, Student Discipline, Teachers & Staff, and Clubs & Activities. This includes everything from classroom problems to safety concerns, discrimination, harassment, or any other campus-related issues."
  },
  {
    id: "access",
    question: "Who has access to the submitted complaints?",
    answer: "Only authorized administrators and relevant department heads have access to submitted complaints. All staff with access are trained on confidentiality protocols and are committed to maintaining the anonymity of submissions."
  }
];

export default function FAQ() {
  return (
    <div className="page-container" data-testid="faq-page">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Find answers to common questions about the complaint system</p>
        </div>

        <Card className="mb-12">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} data-testid={`faq-${faq.id}`}>
                  <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="bg-accent">
          <CardContent className="p-8 text-center">
            <Headphones className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              If you couldn't find the answer you were looking for, feel free to contact our support team.
            </p>
            <Button 
              onClick={() => window.location.href = 'mailto:support@campus-voice.edu?subject=Support Request'}
              data-testid="button-contact-support"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
