import type { Metadata } from "next";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up — AI Quiz System",
  description: "Create your AI Quiz System account",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <SignupForm />
    </main>
  );
}
