"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Spinner } from "@heroui/react";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const response = await fetch("/api/admin/reports");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load reports.");
      setReports(data.reports);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const resolve = async (reportId, action) => {
    if (action === "delete" && !window.confirm("Delete the reported campaign? Contributors will be refunded.")) return;
    setBusy(reportId);
    setError("");
    try {
      const response = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to resolve report.");
      setReports((items) => items.filter((report) => report._id !== reportId));
    } catch (actionError) {
      setError(actionError.message);
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" color="warning" label="Loading reports..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
          Reported Campaigns
        </h1>
        <p className="text-[#645d52] text-xs font-bold uppercase tracking-[0.14em] mt-1">
          Review reports and suspend or remove campaigns.
        </p>
      </div>

      {error && (
        <Card className="border border-red-200 bg-red-50/50 rounded-none shadow-[2px_2px_0_#24231f]">
          <Card.Content className="p-4 text-xs font-bold uppercase tracking-wider text-red-700">
            {error}
          </Card.Content>
        </Card>
      )}

      {reports.length === 0 ? (
        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-8 text-center text-xs font-bold uppercase tracking-wider text-[#776f63]">
            No reported campaigns.
          </Card.Content>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-none border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#ebe3d5] border-b border-[#bfb5a3] text-left">
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Reporter</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Campaign</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Reason</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Date</th>
                <th className="px-4 py-3 font-bold text-xs text-[#565148] uppercase tracking-[0.12em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cfc6b7]/50">
              {reports.map((report) => (
                <tr key={report._id} className="hover:bg-[#ebe3d5]/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-bold text-[#24231f]">{report.reporter_name}</p>
                    <p className="text-xs font-semibold text-[#645d52]">{report.reporter_email}</p>
                  </td>
                  <td className="px-4 py-3 font-bold text-[#24231f]">{report.campaign_title}</td>
                  <td className="px-4 py-3 text-[#645d52] font-semibold max-w-xs">{report.reason}</td>
                  <td className="px-4 py-3 text-xs text-[#645d52] font-semibold">
                    {new Date(report.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-[#b45309] hover:bg-[#854d0e] text-white font-bold uppercase tracking-wider text-[10px] rounded-none shadow-[2px_2px_0_#24231f] transition-all cursor-pointer"
                        isLoading={busy === report._id}
                        onPress={() => resolve(report._id, "suspend")}
                      >
                        Suspend
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#9a3412] hover:bg-[#7f2d0f] text-white font-bold uppercase tracking-wider text-[10px] rounded-none shadow-[2px_2px_0_#24231f] transition-all cursor-pointer"
                        isLoading={busy === report._id}
                        onPress={() => resolve(report._id, "delete")}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
