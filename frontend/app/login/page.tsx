import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login — AI Quiz System",
  description: "Sign in to your AI Quiz System account",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <LoginForm />
    </main>
  );
}
