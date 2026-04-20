"use client";

import { useState } from "react";
import { GlassCard } from "@/components/motion/GlassCard";
import { FileBadge2, HardDriveUpload, Download, ShieldCheck, Loader2 } from "lucide-react";
import { issueCertificate, anchorCertificates } from "@/lib/api";

export default function DashboardPage() {
  const [formData, setFormData] = useState({
    student_id: "",
    name_hash: "",
    course: "",
    grade: "",
  });
  
  const [issueState, setIssueState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [issuedCredential, setIssuedCredential] = useState<any>(null);
  const [issueError, setIssueError] = useState("");

  const [anchorState, setAnchorState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [anchorResult, setAnchorResult] = useState<any>(null);
  const [anchorError, setAnchorError] = useState("");

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIssueState("loading");
    setIssueError("");
    setIssuedCredential(null);
    try {
      const result = await issueCertificate(formData);
      setIssuedCredential(result.credential);
      setIssueState("success");
    } catch (err: any) {
      setIssueError(err.message || "Failed to issue credential");
      setIssueState("error");
    }
  };

  const handleAnchor = async () => {
    setAnchorState("loading");
    setAnchorError("");
    setAnchorResult(null);
    try {
      const result = await anchorCertificates();
      setAnchorResult(result);
      setAnchorState("success");
    } catch (err: any) {
      setAnchorError(err.message || "Failed to anchor");
      setAnchorState("error");
    }
  };

  const downloadJson = () => {
    if (!issuedCredential) return;
    const blob = new Blob([JSON.stringify(issuedCredential, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `credential-${formData.student_id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 py-24">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

      <main className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Admin Console</h1>
          <p className="mt-2 text-gray-400">Issue verifiable credentials and securely sync them to Polygon.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Issue Section */}
          <GlassCard className="p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileBadge2 className="h-6 w-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold">Issue Certificate</h2>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="student_id">Student ID</label>
                <input
                  id="student_id"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  placeholder="e.g. 987654321"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="name_hash">Name Hash (SHA-256)</label>
                <input
                  id="name_hash"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  value={formData.name_hash}
                  onChange={(e) => setFormData({ ...formData, name_hash: e.target.value })}
                  placeholder="0xabcd..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="course">Course / Degree</label>
                <input
                  id="course"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  placeholder="Blockchain Engineering"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1" htmlFor="grade">Grade</label>
                <input
                  id="grade"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  placeholder="A+"
                />
              </div>

              <button
                type="submit"
                disabled={issueState === "loading"}
                className="w-full flex items-center justify-center py-3 px-4 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors disabled:opacity-50"
              >
                {issueState === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Secure Credential"}
              </button>
            </form>

            {issueError && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                Error: {issueError}
              </div>
            )}

            {issueState === "success" && issuedCredential && (
              <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-center space-x-2 text-green-400 mb-3">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="font-medium">Credential Generation Successful</span>
                </div>
                <button
                  onClick={downloadJson}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download w3c.json</span>
                </button>
              </div>
            )}
          </GlassCard>

          {/* Anchor Section */}
          <GlassCard className="p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <HardDriveUpload className="h-6 w-6 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold">Network Sync</h2>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <p className="text-gray-400 mb-6 text-sm">
                Commit newly issued credentials to the continuous Merkle Tree, calculate the new state root, and anchor the cryptographic evidence natively to the Polygon Blockchain.
              </p>

              <button
                onClick={handleAnchor}
                disabled={anchorState === "loading"}
                className="w-full flex items-center justify-center py-3 px-4 rounded-xl font-medium text-white bg-purple-600 hover:bg-purple-500 transition-colors disabled:opacity-50"
              >
                {anchorState === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Anchor Batch to Polygon"}
              </button>
            </div>

            {anchorError && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                Error: {anchorError}
              </div>
            )}

            {anchorState === "success" && anchorResult && (
               <div className="mt-4 space-y-3">
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <h3 className="text-sm font-medium text-purple-300 mb-2">Sync Report</h3>
                    <p className="text-xs text-gray-300"><strong>Status:</strong> {anchorResult.blockchain_status}</p>
                    <p className="text-xs text-gray-300 font-mono break-all mt-1"><strong>Merkle Root:</strong> {anchorResult.merkle_root}</p>
                    {anchorResult.blockchain_tx_hash && (
                       <p className="text-xs text-gray-300 font-mono break-all mt-1"><strong>Tx Hash:</strong> {anchorResult.blockchain_tx_hash}</p>
                    )}
                  </div>
               </div>
            )}
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
