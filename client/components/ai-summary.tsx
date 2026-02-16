"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function AISummaryCard() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const generateSummary = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:8080/api/dashboard/ai-summary",
      );

      setSummary(res.data.summary);
      setOpen(true); 
    } catch {
      setSummary("Failed to generate summary.");
      setOpen(true); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <Button onClick={generateSummary} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>AI Summary</DialogTitle>
            <DialogDescription>
              Here is your generated dashboard summary.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 text-sm whitespace-pre-line text-gray-700">
            {summary}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
