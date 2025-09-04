import ComplaintForm from "@/components/complaint-form";

export default function SubmitComplaint() {
  return (
    <div className="page-container" data-testid="submit-complaint-page">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Submit Anonymous Complaint</h1>
          <p className="text-muted-foreground">Your identity will remain completely confidential</p>
        </div>

        <ComplaintForm />
      </div>
    </div>
  );
}
