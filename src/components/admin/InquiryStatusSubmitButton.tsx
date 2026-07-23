"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";

export function InquiryStatusSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} size="small" type="submit" variant="secondary">
      {pending ? "Updating…" : "Update status"}
    </Button>
  );
}

