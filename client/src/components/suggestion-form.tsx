import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertSuggestionSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FloatingInput, FloatingTextarea } from "@/components/floating-input";
import { SUGGESTION_TYPES } from "@/lib/constants";
import { Lightbulb, RotateCcw, CheckCircle } from "lucide-react";
import { z } from "zod";

type FormData = z.infer<typeof insertSuggestionSchema>;

export default function SuggestionForm() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ referenceId: string } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const form = useForm<FormData>({
    resolver: zodResolver(insertSuggestionSchema),
    defaultValues: {
      title: "",
      type: "",
      description: "",
      benefits: "",
    },
  });

  const createSuggestionMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/suggestions", data);
      return response.json();
    },
    onSuccess: (data) => {
      setSubmissionResult(data);
      setShowSuccessModal(true);
      queryClient.invalidateQueries({ queryKey: ["/api/suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your suggestion. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    // Validate required fields
    if (!data.title?.trim() || !data.description?.trim() || !data.type?.trim()) {
      toast({
        title: "Please fill in all required fields",
        description: "Title, description, and type are required to submit a suggestion.",
        variant: "destructive",
      });
      return;
    }
    
    createSuggestionMutation.mutate(data);
  };

  // Auto-redirect to dashboard after 4 seconds
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        setLocation('/');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, setLocation]);

  const clearForm = () => {
    form.reset();
  };

  return (
    <div className="bg-card p-8 rounded-lg border border-border shadow-sm">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FloatingInput
          label="Suggestion Title *"
          {...form.register("title")}
          data-testid="input-suggestion-title"
        />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Suggestion Type</label>
          <Select
            value={form.watch("type")}
            onValueChange={(value) => form.setValue("type", value)}
          >
            <SelectTrigger className="w-full" data-testid="select-suggestion-type">
              <SelectValue placeholder="Select type..." />
            </SelectTrigger>
            <SelectContent>
              {SUGGESTION_TYPES.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.type && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.type.message}</p>
          )}
        </div>

        <FloatingTextarea
          label="Detailed Description *"
          rows={6}
          {...form.register("description")}
          data-testid="textarea-suggestion-description"
        />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
        )}

        <FloatingTextarea
          label="Expected Benefits (Optional)"
          rows={3}
          {...form.register("benefits")}
          data-testid="textarea-suggestion-benefits"
        />

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            type="submit"
            className="w-full sm:flex-1 py-3 sm:py-4 font-medium"
            disabled={createSuggestionMutation.isPending}
            data-testid="button-submit-suggestion"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            {createSuggestionMutation.isPending ? "Submitting..." : "Submit Suggestion"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={clearForm}
            className="w-full sm:w-auto px-6 py-3 sm:py-4 font-medium"
            data-testid="button-clear-suggestion"
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
              <span>Suggestion Submitted Successfully!</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                Thank you for your valuable suggestion! We'll review it carefully.
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
                    Keep this ID for tracking your suggestion status
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
                  setLocation('/');
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
