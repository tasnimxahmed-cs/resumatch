"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Fields {
  title: string;
  company: string;
  summary: string;
  expectations: string;
  qualifications: string;
  fullJD: string;
}

interface EditJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editableFields: Fields;
  onChange: (fields: Fields) => void;
  onSave: () => void;
  onDiscard: () => void;
  loading: boolean;
}

export function EditJobModal({
  open,
  onOpenChange,
  editableFields,
  onChange,
  onSave,
  onDiscard,
  loading,
}: EditJobModalProps) {
  const handleFieldChange = (field: keyof Fields, value: string) => {
    onChange({ ...editableFields, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Extracted Job Info</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <Input
              value={editableFields.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <Input
              value={editableFields.company}
              onChange={(e) => handleFieldChange("company", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Summary</label>
            <Textarea
              value={editableFields.summary}
              onChange={(e) => handleFieldChange("summary", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Expectations</label>
            <Textarea
              value={editableFields.expectations}
              onChange={(e) => handleFieldChange("expectations", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Qualifications</label>
            <Textarea
              value={editableFields.qualifications}
              onChange={(e) => handleFieldChange("qualifications", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="mt-4 space-x-2">
          <Button
            onClick={onDiscard}
            disabled={loading}
            className="bg-bg-dark text-brand-dark hover:bg-bg-dark/75 dark:bg-bg-light dark:text-brand-light dark:hover:bg-bg-light/75 cursor-pointer shadow transition"
          >
            Discard
          </Button>
          <Button
            onClick={onSave}
            disabled={loading}
            className="bg-brand-light dark:bg-brand-dark text-text-dark hover:bg-brand-light/75 dark:hover:bg-brand-dark/75 cursor-pointer shadow transition"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
