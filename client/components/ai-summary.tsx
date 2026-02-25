"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { apiFetch } from "@/lib/api";
export default function AiSummary() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const generateSummary = async () => {
    try {
      setLoading(true);

      const data = await apiFetch("/api/dashboard/ai-summary");
      setSummary(data.data.summary);
      setOpen(true);
    } catch (error) {
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Summary</DialogTitle>
            <DialogDescription>
              Here is your generated dashboard summary.
            </DialogDescription>
          </DialogHeader>

          <div
            className="prose prose-sm max-w-none 
  prose-h2:mt-6 
  prose-h2:border-b 
  prose-h2:pb-2 
  prose-h3:text-primary 
  prose-strong:text-black"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
