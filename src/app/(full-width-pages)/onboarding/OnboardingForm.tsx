"use client";

import React, { useActionState } from "react";
import { createOrganization } from "./actions";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

export default function OnboardingForm() {
  const [state, formAction, isPending] = useActionState(createOrganization, null);

  return (
    <form action={formAction}>
       {state?.error && (
          <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
            {state.error}
          </div>
        )}
      <div className="mb-4">
        <Label>Organization Name</Label>
        <Input name="name" placeholder="My Awesome Restaurant" required />
      </div>
      <Button className="w-full" disabled={isPending}>
        {isPending ? "Creating..." : "Create Organization"}
      </Button>
    </form>
  );
}

