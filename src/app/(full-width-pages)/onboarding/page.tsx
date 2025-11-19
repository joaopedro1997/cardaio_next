import { Metadata } from "next";
import OnboardingForm from "./OnboardingForm";

export const metadata: Metadata = {
  title: "Create Organization",
};

export default function OnboardingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
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

