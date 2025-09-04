import SuggestionForm from "@/components/suggestion-form";

export default function Suggestions() {
  return (
    <div className="p-8" data-testid="suggestions-page">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Share Your Ideas</h1>
          <p className="text-muted-foreground">Help us improve campus life with your suggestions</p>
        </div>

        <SuggestionForm />
      </div>
    </div>
  );
}
