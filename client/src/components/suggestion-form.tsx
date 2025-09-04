import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertSuggestionSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FloatingInput, FloatingTextarea } from "@/components/floating-input";
import { SUGGESTION_TYPES } from "@/lib/constants";
import { Lightbulb, RotateCcw } from "lucide-react";
import { z } from "zod";

type FormData = z.infer<typeof insertSuggestionSchema>;

export default function SuggestionForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      toast({
        title: "Suggestion Submitted Successfully",
        description: "Thank you for your valuable suggestion! We'll review it carefully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/suggestions"] });
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
    createSuggestionMutation.mutate(data);
  };

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

        <div className="flex space-x-4">
          <Button
            type="submit"
            className="flex-1 py-4 font-medium"
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
            className="px-6 py-4 font-medium"
            data-testid="button-clear-suggestion"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear Form
          </Button>
        </div>
      </form>
    </div>
  );
}
