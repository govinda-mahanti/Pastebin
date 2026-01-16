"use client"

import { useState } from "react"
import { Link, Copy, Check, FileText, Clock, Eye } from "lucide-react"
import { createPaste } from "@/lib/api"

export default function Page() {
  const [content, setContent] = useState("")
  const [ttl, setTtl] = useState("")
  const [ttlUnit, setTtlUnit] = useState("minutes")
  const [views, setViews] = useState("")
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const convertToSeconds = (value: string, unit: string) => {
    if (!value) return undefined
    const num = Number(value)
    if (unit === "minutes") return num * 60
    if (unit === "hours") return num * 3600
    if (unit === "days") return num * 86400
    return num
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const data = await createPaste({
        content,
        ttl_seconds: convertToSeconds(ttl, ttlUnit),
        max_views: views ? Number(views) : undefined,
      })
      setUrl(`${window.location.origin}/paste/${data.id}`)
    } finally {
      setIsLoading(false)
    }
  }
 const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-t-lg p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-100">Create Paste</h1>
              <p className="text-sm text-slate-400 mt-1">Share your text securely with time and view limits</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-slate-950 border-x border-b border-slate-700/50 rounded-b-lg p-6 shadow-2xl space-y-6">
          {/* Textarea */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Content
            </label>
            <textarea
              placeholder="Enter your text here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none font-mono text-sm"
            />
          </div>

          {/* TTL and Max Views */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                Time to Live
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="e.g., 30"
                  value={ttl}
                  onChange={(e) => setTtl(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <select
                  value={ttlUnit}
                  onChange={(e) => setTtlUnit(e.target.value)}
                  className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer"
                >
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
              <p className="text-xs text-slate-500 mt-1">Leave empty for no expiration</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4 text-slate-400" />
                Maximum Views
              </label>
              <input
                type="number"
                placeholder="e.g., 10"
                value={views}
                onChange={(e) => setViews(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">Leave empty for unlimited views</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <Link className="w-5 h-5" />
                Create Paste
              </>
            )}
          </button>

          {/* URL Display */}
          {url && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <label className="text-sm font-medium text-emerald-400">
                    Paste Created Successfully!
                  </label>
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
              
              <div className="bg-slate-950 border border-slate-700 rounded-lg p-4">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="w-full bg-transparent text-emerald-400 font-mono text-sm focus:outline-none"
                />
              </div>
              
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
              >
                Open in new tab →
              </a>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-4 text-center text-slate-400 text-sm">
          <p>Your paste will be securely stored and shareable via URL</p>
        </div>
      </div>
    </div>
  );
}
