import { ActivationForm } from "@/components/auth/activation-form";

export default function ActivationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-f2m-cream to-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <ActivationForm />
      </div>
    </div>
  );
}
