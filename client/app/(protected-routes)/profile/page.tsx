import Profile from "@/components/modules/auth/profile";

export const metadata = {
  title: "Profile - Invento",
  description: "Your Invento profile",
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <Profile />
    </main>
  );
}