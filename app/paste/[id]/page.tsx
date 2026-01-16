"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getPaste } from "@/lib/api"
import { Copy, Check, FileText, Clock } from "lucide-react"

export default function Page() {
  const params = useParams()
  const id = params.id as string

  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getPaste(id)
      .then((data) => setContent(data.content))
      .catch(() => setError("Paste not found or expired"))
      .finally(() => setIsLoading(false))
  }, [id])

   const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-slate-300 text-lg">Loading paste...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/30 rounded-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-slate-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-t-lg p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-100">Paste Content</h1>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <p className="text-sm text-slate-400">ID: {id}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-950 border-x border-b border-slate-700/50 rounded-b-lg p-6 shadow-2xl">
          <pre className="text-emerald-400 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words overflow-x-auto">
            {content}
          </pre>
        </div>

        <div className="mt-4 text-center text-slate-400 text-sm">
          <p>This paste is securely stored and can be shared using this URL</p>
        </div>
      </div>
    </div>
  );
}
