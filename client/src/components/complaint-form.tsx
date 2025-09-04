import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertComplaintSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FloatingInput, FloatingTextarea } from "@/components/floating-input";
import CategorySelector from "@/components/category-selector";
import { PRIORITY_LEVELS } from "@/lib/constants";
import { Send, RotateCcw, CheckCircle } from "lucide-react";
import { z } from "zod";

const formSchema = insertComplaintSchema.extend({
  wantsFollowup: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

export default function ComplaintForm() {
  const [showContactFields, setShowContactFields] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ referenceId: string } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      description: "",
      category: "",
      priority: "medium",
      contactEmail: "",
      wantsFollowup: false,
    },
  });

  const createComplaintMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { wantsFollowup, ...complaintData } = data;
      const response = await apiRequest("POST", "/api/complaints", complaintData);
      return response.json();
    },
    onSuccess: (data) => {
      setSubmissionResult(data);
      setShowSuccessModal(true);
      queryClient.invalidateQueries({ queryKey: ["/api/complaints"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      form.reset();
      setShowContactFields(false);
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your complaint. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    // Validate required fields
    if (!data.subject?.trim() || !data.description?.trim() || !data.category?.trim()) {
      toast({
        title: "Please fill in all required fields",
        description: "Subject, description, and category are required to submit a complaint.",
        variant: "destructive",
      });
      return;
    }
    
    createComplaintMutation.mutate(data);
  };

  // Auto-redirect to dashboard after 4 seconds
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        setLocation('/dashboard');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, setLocation]);

  const clearForm = () => {
    form.reset();
    setShowContactFields(false);
  };

  return (
    <div className="bg-card p-8 rounded-lg border border-border shadow-sm">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CategorySelector
          selectedCategory={form.watch("category")}
          onCategoryChange={(category) => form.setValue("category", category)}
        />

        <FloatingInput
          label="Subject *"
          {...form.register("subject")}
          data-testid="input-subject"
        />
        {form.formState.errors.subject && (
          <p className="text-sm text-destructive">{form.formState.errors.subject.message}</p>
        )}

        <FloatingTextarea
          label="Detailed Description *"
          rows={6}
          {...form.register("description")}
          data-testid="textarea-description"
        />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Priority Level</label>
          <RadioGroup
            value={form.watch("priority")}
            onValueChange={(value) => form.setValue("priority", value)}
            className="flex flex-wrap gap-4"
            data-testid="priority-selector"
          >
            {PRIORITY_LEVELS.map((priority) => (
              <div key={priority.id} className="flex items-center space-x-2">
                <RadioGroupItem value={priority.id} id={priority.id} />
                <Label htmlFor={priority.id} className="text-sm cursor-pointer">
                  {priority.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="contact-followup"
              checked={showContactFields}
              onCheckedChange={(checked) => {
                setShowContactFields(checked as boolean);
                form.setValue("wantsFollowup", checked as boolean);
                if (!checked) {
                  form.setValue("contactEmail", "");
                }
              }}
              data-testid="checkbox-followup"
            />
            <div>
              <label htmlFor="contact-followup" className="text-sm font-medium text-foreground cursor-pointer">
                I would like to receive updates on this submission
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Optional: Provide contact information only if you want follow-up communication
              </p>
            </div>
          </div>
          
          {showContactFields && (
            <div className="mt-4">
              <FloatingInput
                label="Email Address (Optional)"
                type="email"
                {...form.register("contactEmail")}
                data-testid="input-email"
              />
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <Button
            type="submit"
            className="flex-1 py-4 font-medium"
            disabled={createComplaintMutation.isPending}
            data-testid="button-submit"
          >
            <Send className="h-4 w-4 mr-2" />
            {createComplaintMutation.isPending ? "Submitting..." : "Submit Complaint"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={clearForm}
            className="px-6 py-4 font-medium"
            data-testid="button-clear"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear Form
          </Button>
        </div>
      </form>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span>Complaint Submitted Successfully!</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                Your complaint has been submitted and will be reviewed by our team.
              </p>
              {submissionResult && (
                <div className="bg-white dark:bg-slate-800 p-3 rounded border">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reference ID:
                  </p>
                  <p className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400">
                    {submissionResult.referenceId}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Keep this ID for tracking your complaint status
                  </p>
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Redirecting to dashboard in a few seconds...
              </p>
              <Button 
                onClick={() => {
                  setShowSuccessModal(false);
                  setLocation('/dashboard');
                }}
                className="mt-3"
                variant="outline"
              >
                Go to Dashboard Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
