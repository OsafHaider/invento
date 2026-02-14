import SignIn from "@/components/modules/auth/sign-in";

export const metadata = {
  title: "Sign In - Invento",
  description: "Sign in to your Invento account",
};

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <SignIn />
    </main>
  );
}
