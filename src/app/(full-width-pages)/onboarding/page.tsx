import { Metadata } from "next";
import OnboardingForm from "./OnboardingForm";

export const metadata: Metadata = {
  title: "Create Organization",
};

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          Setup your Organization
        </h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Create an organization to manage your dishes and categories.
        </p>
        <OnboardingForm />
      </div>
    </div>
  );
}
