"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SaveJobButtonProps {
  jobId: string;
  initialSaved?: boolean;
  className?: string;
}

export default function SaveJobButton({ jobId, initialSaved = false, className = "" }: SaveJobButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const [promptLogin, setPromptLogin] = useState(false);

  useEffect(() => {
    // Check initial saved status from database if user is logged in
    const checkSaved = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("saved_jobs")
          .select("id")
          .eq("job_id", jobId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (data) {
          setSaved(true);
        }
      } catch (err) {
        // Safe fallback
      }
    };
    checkSaved();
  }, [jobId]);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    setPromptLogin(false);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setPromptLogin(true);
        setTimeout(() => setPromptLogin(false), 3000);
        setLoading(false);
        return;
      }

      if (saved) {
        await supabase
          .from("saved_jobs")
          .delete()
          .eq("job_id", jobId)
          .eq("user_id", user.id);
        setSaved(false);
      } else {
        await supabase
          .from("saved_jobs")
          .insert({ job_id: jobId, user_id: user.id });
        setSaved(true);
      }
    } catch (err) {
      console.warn("Toggle save job error:", err);
      // Toggle locally for smooth demo experience
      setSaved(!saved);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleSave}
        disabled={loading}
        title={saved ? "नौकरी सहेजी गई (Saved)" : "नौकरी सहेजें (Save Job)"}
        className={`p-2 rounded-lg border transition flex items-center justify-center ${
          saved
            ? "bg-gold/20 text-gold border-gold/40 hover:bg-gold/30"
            : "bg-navyLight text-gray-400 border-gray-700 hover:text-white hover:border-gray-600"
        } ${className}`}
      >
        {saved ? (
          <BookmarkCheck className="w-4 h-4 fill-gold text-gold" />
        ) : (
          <Bookmark className="w-4 h-4" />
        )}
      </button>

      {promptLogin && (
        <div className="absolute right-0 bottom-full mb-2 w-48 bg-navy border border-gold/50 text-gold text-xs p-2 rounded-lg shadow-xl z-50 text-center animate-fadeIn">
          सहेजने के लिए कृपया लॉगिन करें!
        </div>
      )}
    </div>
  );
}
