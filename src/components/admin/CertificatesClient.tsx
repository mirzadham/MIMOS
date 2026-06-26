"use client";

import { useState, useTransition } from "react";
import { issueCertificateAction } from "@/app/actions/adminActions";
import { jsPDF } from "jspdf";
import { Award, Download, ShieldCheck, Search, Users, Sparkles, Loader2 } from "lucide-react";

interface Enrollment {
  id: string;
  name: string;
  email: string;
  company: string | null;
  status: string;
  programId: string;
  program: {
    id: string;
    title: string;
  };
  certificates: Array<{
    certificateNumber: string;
    verifyHash: string;
    issueDate: Date;
  }>;
}

interface CertificatesClientProps {
  enrollments: Enrollment[];
}

export default function CertificatesClient({ enrollments }: CertificatesClientProps) {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"PENDING" | "ISSUED">("PENDING");

  const handleIssueCertificate = (student: Enrollment) => {
    startTransition(async () => {
      const res = await issueCertificateAction(
        student.id,
        student.name,
        student.email,
        student.program.id,
        student.program.title
      );
      if (res.success && res.certificate) {
        alert(`Certificate ${res.certificate.certificateNumber} successfully generated for ${student.name}!`);
        // Trigger auto-download
        downloadCertPDF(
          res.certificate.certificateNumber,
          student.name,
          student.program.title,
          new Date(res.certificate.issueDate).toLocaleDateString(),
          res.certificate.verifyHash
        );
      }
    });
  };

  const downloadCertPDF = (
    certNumber: string,
    studentName: string,
    programTitle: string,
    date: string,
    hash: string
  ) => {
    // Generate Landscape A4 PDF
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // 1. Draw outer double frame
    doc.setDrawColor(215, 86, 159); // MIMOS Magenta #d7569f
    doc.setLineWidth(1.5);
    doc.rect(8, 8, 281, 194); // Outer border
    doc.setDrawColor(148, 163, 184); // Slate 400
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 277, 190); // Inner border

    // 2. Logo Branding Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.text("MIMOS BERHAD", 148, 30, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text("NATIONAL APPLIED R&D TALENT DEVELOPMENT CENTRE", 148, 36, { align: "center" });

    // Decorative line
    doc.setDrawColor(167, 33, 144);
    doc.setLineWidth(0.8);
    doc.line(118, 42, 178, 42);

    // 3. Certificate of Achievement Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(30, 41, 59);
    doc.text("CERTIFICATE OF ATTENDANCE", 148, 62, { align: "center" });

    // 4. Award description
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105); // Slate 600
    doc.text("This is officially awarded to", 148, 78, { align: "center" });

    // Student Name
    doc.setFont("times", "bolditalic");
    doc.setFontSize(24);
    doc.setTextColor(30, 41, 59);
    doc.text(studentName.toUpperCase(), 148, 92, { align: "center" });

    // Core Course details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text("for successfully attending and completing the physical upskilling run on:", 148, 106, { align: "center" });

    // Program Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(167, 33, 144); // Brand color #a72190
    doc.text(programTitle, 148, 120, { align: "center" });

    // 5. Signature metadata fields
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Date of Issue: ${date}`, 45, 155);
    doc.text(`Certificate No: ${certNumber}`, 45, 162);

    // Right side: Director / Sign line
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.5);
    doc.line(200, 152, 250, 152);
    doc.text("MIMOS Academy Director", 225, 158, { align: "center" });
    doc.text("Applied R&D Division", 225, 163, { align: "center" });

    // 6. Security verification hash footnote
    doc.setFont("courier", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`VERIFICATION HASH: ${hash}`, 148, 188, { align: "center" });

    // Save File
    doc.save(`MIMOS_Academy_Cert_${certNumber.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
  };

  // Filter list
  const filtered = enrollments.filter((student) => {
    const isMatchedTab =
      activeTab === "PENDING"
        ? student.status === "ATTENDED"
        : student.status === "CERTIFIED";

    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.program.title.toLowerCase().includes(searchQuery.toLowerCase());

    return isMatchedTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-foreground">Certificate Vault</h1>
          <p className="text-xs text-slate-500 mt-1">Issue digital, cryptographically verifiable certificates to attendees.</p>
        </div>
      </div>

      {/* Tabs Selector & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`rounded-full px-4 py-2 text-xs font-bold border transition-all ${
              activeTab === "PENDING"
                ? "bg-primary border-primary text-white shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            Pending Issuance ({enrollments.filter(e => e.status === "ATTENDED").length})
          </button>
          <button
            onClick={() => setActiveTab("ISSUED")}
            className={`rounded-full px-4 py-2 text-xs font-bold border transition-all ${
              activeTab === "ISSUED"
                ? "bg-primary border-primary text-white shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            Issued Certificates ({enrollments.filter(e => e.status === "CERTIFIED").length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search attendees..."
            className="w-full rounded-md border border-slate-300 pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-primary"
          />
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>

      {/* Certificates Data Table */}
      {filtered.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Student Details</th>
                <th className="px-6 py-3 font-semibold">Program Title</th>
                <th className="px-6 py-3 font-semibold">
                  {activeTab === "PENDING" ? "Status" : "Certificate details"}
                </th>
                <th className="px-6 py-3 font-semibold text-right">Certificate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
              {filtered.map((student) => {
                const cert = student.certificates?.[0];
                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800 block text-sm">{student.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{student.email}</span>
                      {student.company && (
                        <span className="text-[9px] font-bold text-slate-400 block uppercase mt-0.5">
                          {student.company}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-700 block max-w-xs truncate">
                        {student.program.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      {activeTab === "PENDING" ? (
                        <span className="inline-flex items-center gap-1 rounded bg-blue-50 text-blue-600 px-2.5 py-0.5 text-[9px] font-bold">
                          <Users className="h-3 w-3" />
                          <span>Attended Program</span>
                        </span>
                      ) : (
                        cert && (
                          <div className="font-body space-y-0.5">
                            <span className="font-bold text-slate-800 block">No: {cert.certificateNumber}</span>
                            <span className="text-[9px] text-slate-400 font-mono block truncate max-w-[150px]" title={cert.verifyHash}>
                              Hash: {cert.verifyHash}
                            </span>
                          </div>
                        )
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {activeTab === "PENDING" ? (
                        <button
                          onClick={() => handleIssueCertificate(student)}
                          disabled={isPending}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white px-3.5 py-2 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {isPending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="h-3.5 w-3.5" />
                          )}
                          <span>Generate Certificate</span>
                        </button>
                      ) : (
                        cert && (
                          <button
                            onClick={() =>
                              downloadCertPDF(
                                cert.certificateNumber,
                                student.name,
                                student.program.title,
                                new Date(cert.issueDate).toLocaleDateString(),
                                cert.verifyHash
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition-all shadow-sm"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>Download PDF</span>
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <Award className="mx-auto h-10 w-10 text-slate-300 animate-pulse" />
          <h3 className="mt-4 font-heading text-sm font-bold text-foreground">
            {activeTab === "PENDING" ? "No pending issuances" : "No certificates issued yet"}
          </h3>
          <p className="mt-2 text-xs text-slate-500 font-body">
            {activeTab === "PENDING"
              ? "All attended students have been successfully certified."
              : "Import registrations, check off attendance, and generate files here."}
          </p>
        </div>
      )}

    </div>
  );
}
