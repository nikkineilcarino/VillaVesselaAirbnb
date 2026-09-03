"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";

export function InquiryDeleteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div className="grid gap-3">
      <label className="flex items-start gap-3 text-sm leading-6 text-foreground/75">
        <input
          className="mt-1 size-4 shrink-0 accent-danger"
          disabled={pending}
          name="confirmation"
          required
          type="checkbox"
          value="delete"
        />
        <span>
          I confirm that this exact inquiry should be permanently deleted from
          the active database.
        </span>
      </label>
      <Button
        className="justify-self-start"
        disabled={pending}
        size="small"
        type="submit"
        variant="danger"
      >
        {pending ? "Deleting..." : "Delete this inquiry"}
      </Button>
    </div>
  );
}
