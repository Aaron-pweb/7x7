"use client";

import { useState, useTransition } from "react";
import { createChallengeTemplate } from "@/app/actions/journal";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(10);
  const [prompts, setPrompts] = useState<string[]>([""]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAddPrompt = () => setPrompts([...prompts, ""]);
  const handleRemovePrompt = (i: number) => setPrompts(prompts.filter((_, idx) => idx !== i));
  const handlePromptChange = (i: number, val: string) => {
    const newPrompts = [...prompts];
    newPrompts[i] = val;
    setPrompts(newPrompts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validPrompts = prompts.filter(p => p.trim() !== "");
    if (validPrompts.length === 0) return alert("Must have at least 1 prompt");

    startTransition(async () => {
      await createChallengeTemplate({ title, description, duration, prompts: validPrompts });
      router.push("/dashboard");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-surface p-6 rounded-2xl border border-primary/10">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-on-surface-variant">Challenge Title</label>
        <input 
          required 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          className="w-full bg-surface-variant/50 text-on-surface rounded-xl px-4 py-3 border border-transparent focus:border-primary/50 outline-none" 
          placeholder="e.g. 21 Days of Left Hand Writing"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-on-surface-variant">Description</label>
        <textarea 
          required 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          className="w-full bg-surface-variant/50 text-on-surface rounded-xl px-4 py-3 border border-transparent focus:border-primary/50 outline-none" 
          placeholder="Describe the challenge..."
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-on-surface-variant">Duration (Days)</label>
        <input 
          required 
          type="number" 
          min="1" 
          value={duration} 
          onChange={e => setDuration(parseInt(e.target.value))} 
          className="w-full max-w-[200px] bg-surface-variant/50 text-on-surface rounded-xl px-4 py-3 border border-transparent focus:border-primary/50 outline-none" 
        />
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-on-surface-variant">Daily Prompts</label>
          <button type="button" onClick={handleAddPrompt} className="text-primary flex items-center gap-1 text-sm font-bold">
            <Plus className="w-4 h-4" /> Add Prompt
          </button>
        </div>
        {prompts.map((p, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input 
              value={p}
              onChange={e => handlePromptChange(i, e.target.value)}
              className="flex-grow bg-surface-variant/50 text-on-surface rounded-xl px-4 py-3 border border-transparent focus:border-primary/50 outline-none"
              placeholder={`Prompt ${i + 1}`}
            />
            {prompts.length > 1 && (
              <button type="button" onClick={() => handleRemovePrompt(i)} className="p-3 text-error hover:bg-error/10 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button 
        disabled={isPending}
        className="mt-6 w-full py-4 bg-primary text-on-primary rounded-xl font-bold font-headline-md disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Publish Challenge"}
      </button>
    </form>
  );
}
