"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";

export function CopyAddressButton({ address }: { address: string }) {
  const [status, setStatus] = useState<"copied" | "error" | "idle">("idle");

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <Button onClick={copyAddress} variant="secondary">
        {status === "copied" ? (
          <Check aria-hidden="true" className="mr-2" size={18} />
        ) : (
          <Copy aria-hidden="true" className="mr-2" size={18} />
        )}
        {status === "copied" ? "Address copied" : "Copy address"}
      </Button>
      <p aria-live="polite" className="mt-2 min-h-5 text-sm text-foreground/75" role="status">
        {status === "copied"
          ? "The confirmed text address is in your clipboard."
          : status === "error"
            ? "Copying was unavailable. Select the address text above instead."
            : ""}
      </p>
    </div>
  );
}
