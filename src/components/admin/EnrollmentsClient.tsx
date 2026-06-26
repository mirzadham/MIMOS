"use client";

import { useState, useTransition, useRef } from "react";
import { importEnrollmentsAction, updateEnrollmentStatusAction } from "@/app/actions/adminActions";
import Papa from "papaparse";
import { 
  FileSpreadsheet, 
  Upload, 
  AlertCircle, 
  CheckCircle, 
  Search, 
  Check, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Users
} from "lucide-react";

interface Program {
  id: string;
  title: string;
}

interface Enrollment {
  id: string;
  name: string;
  email: string;
  company: string | null;
  registrationDate: Date;
  status: string;
  program: {
    title: string;
  };
}

interface EnrollmentsClientProps {
  programs: Program[];
  initialEnrollments: Enrollment[];
}

export default function EnrollmentsClient({
  programs,
  initialEnrollments,
}: EnrollmentsClientProps) {
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // CSV parsing states
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Student filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Handles Excel/CSV drops
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!selectedProgramId) {
      setErrorMsg("Please select a training program before uploading the registration file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setErrorMsg("File parsing warning. Some rows might contain errors.");
        }
        if (results.data.length === 0) {
          setErrorMsg("The uploaded file is empty.");
          return;
        }

        // Auto map columns from Microsoft Forms exports
        // MS Forms usually names columns like: "Name", "Email", "Start time", "Organization", etc.
        const firstRow = results.data[0] as any;
        const keys = Object.keys(firstRow);
        setHeaders(keys);

        // Map parsed columns to our expected schema
        const mapped = results.data.map((row: any) => {
          const name = row["Name"] || row["Full Name"] || row["Nama"] || Object.values(row)[1] || "";
          const email = row["Email"] || row["Email Address"] || row["E-mel"] || Object.values(row)[2] || "";
          const company = row["Company"] || row["Organization"] || row["Syarikat"] || row["Employer"] || "";
          const date = row["Start time"] || row["Completion time"] || row["Masa mula"] || "";
          return {
            name: String(name).trim(),
            email: String(email).trim().toLowerCase(),
            company: String(company).trim(),
            date: date ? String(date).trim() : undefined
          };
        }).filter(r => r.name && r.email.includes("@"));

        if (mapped.length === 0) {
          setErrorMsg("Could not map columns. Make sure the CSV file has columns labeled 'Name' and 'Email'.");
          setParsedData([]);
        } else {
          setParsedData(mapped);
          setSuccessMsg(`Successfully parsed ${mapped.length} registrant rows from CSV. Review preview below.`);
        }
      },
      error: (e) => {
        setErrorMsg("Failed to read file: " + e.message);
      }
    });
  };

  const handleImport = () => {
    if (!selectedProgramId || parsedData.length === 0) return;
    setErrorMsg(null);

    startTransition(async () => {
      const res = await importEnrollmentsAction(selectedProgramId, parsedData);
      if (res.success) {
        setSuccessMsg(`Success! Imported ${res.successCount} registrations. (Skipped/Existing: ${res.skippedCount})`);
        setParsedData([]);
        setHeaders([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setErrorMsg("Failed to import enrollment rows to database.");
      }
    });
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    startTransition(async () => {
      await updateEnrollmentStatusAction(id, newStatus);
    });
  };

  // Filter Enrollments List
  const filteredEnrollments = initialEnrollments.filter((enroll) => {
    const matchesSearch =
      searchQuery === "" ||
      enroll.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enroll.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (enroll.company && enroll.company.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" || enroll.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10">
      
      {/* Action Header */}
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-slate-900">Registrations & Importer</h1>
        <p className="text-xs text-slate-500 mt-1">Upload Microsoft Forms CSV schedules and track physical attendance.</p>
      </div>

      {/* CSV Drop Importer Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase border-b border-slate-100 pb-3">
          <FileSpreadsheet className="h-4.5 w-4.5" />
          <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
            Microsoft Forms CSV Importer
          </h3>
        </div>

        {/* Form Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-body items-end">
          <div className="space-y-1 md:col-span-2">
            <label className="font-bold text-slate-700 uppercase block">Target Training Program</label>
            <select
              value={selectedProgramId}
              onChange={(e) => {
                setSelectedProgramId(e.target.value);
                setParsedData([]);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="w-full rounded-md border border-slate-300 px-3 py-2.5 bg-white focus:border-primary focus:outline-none"
            >
              <option value="">Select program to import registration list into</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={!selectedProgramId}
              className="hidden"
              id="csv-file-selector"
            />
            <label
              htmlFor="csv-file-selector"
              className={`w-full flex items-center justify-center gap-2 border border-dashed rounded-lg px-4 py-2.5 font-bold cursor-pointer transition-all ${
                selectedProgramId 
                  ? "border-teal/40 bg-mint-light/25 text-teal hover:bg-mint-light/50" 
                  : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>Select CSV File</span>
            </label>
          </div>
        </div>

        {/* Feedback Alert banners */}
        {errorMsg && (
          <div className="rounded-lg bg-red-50 p-3.5 border border-red-150 flex items-start gap-2.5 text-xs text-red-600">
            <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="rounded-lg bg-emerald-50 p-3.5 border border-emerald-150 flex items-start gap-2.5 text-xs text-emerald-700">
            <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Preview of Mapped Rows */}
        {parsedData.length > 0 && (
          <div className="border border-slate-100 rounded-xl overflow-hidden space-y-4">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>CSV Importer Preview (First 5 Rows)</span>
              <span className="text-teal">{parsedData.length} valid rows mapped</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-body">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="px-4 py-2 font-semibold">Name</th>
                    <th className="px-4 py-2 font-semibold">Email</th>
                    <th className="px-4 py-2 font-semibold">Company</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-slate-600 font-medium">
                  {parsedData.slice(0, 5).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2.5 text-slate-800 font-bold">{row.name}</td>
                      <td className="px-4 py-2.5 font-mono text-[11px]">{row.email}</td>
                      <td className="px-4 py-2.5">{row.company || "Individual"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleImport}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-teal hover:from-primary-hover hover:to-teal-hover text-white px-5 py-2.5 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Importing rows...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Import Registrants</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enrolled Students list & Attendance Trackers */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4.5 w-4.5 text-primary" />
            <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
              Student Attendance & Status
            </h3>
          </div>

          {/* Filtering Controls */}
          <div className="flex gap-2 text-xs font-semibold">
            {/* Status tabs */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-1.5 bg-white focus:outline-none focus:border-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="REGISTERED">Registered</option>
              <option value="ATTENDED">Attended</option>
              <option value="CERTIFIED">Certified</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students..."
                className="rounded-md border border-slate-300 pl-8 pr-3 py-1.5 focus:outline-none focus:border-primary"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Students Table */}
        {filteredEnrollments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="px-4 py-3 font-semibold">Student info</th>
                  <th className="px-4 py-3 font-semibold">Training Course</th>
                  <th className="px-4 py-3 font-semibold">Registered Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Physical Attendance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                {filteredEnrollments.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-800 block">{student.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{student.email}</span>
                      {student.company && (
                        <span className="text-[9px] font-bold text-slate-400 block uppercase mt-0.5">
                          {student.company}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 max-w-[150px] truncate">
                      <span className="font-semibold text-slate-700">{student.program.title}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span>{new Date(student.registrationDate).toLocaleDateString()}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                        student.status === "CERTIFIED" ? "bg-emerald-50 text-emerald-600" :
                        student.status === "ATTENDED" ? "bg-blue-50 text-blue-600" :
                        student.status === "CANCELLED" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1">
                      {student.status === "REGISTERED" && (
                        <button
                          onClick={() => handleStatusChange(student.id, "ATTENDED")}
                          className="inline-flex items-center gap-1 rounded bg-teal/10 text-teal px-2.5 py-1 hover:bg-teal hover:text-white transition-all text-[10px] font-bold cursor-pointer"
                        >
                          <Check className="h-3 w-3" />
                          <span>Mark Attended</span>
                        </button>
                      )}
                      {student.status === "ATTENDED" && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Ready for Certification
                        </span>
                      )}
                      {student.status === "CERTIFIED" && (
                        <div className="flex justify-end gap-1 text-teal">
                          <ShieldCheck className="h-4.5 w-4.5" />
                          <span className="text-[10px] font-bold uppercase">Certified</span>
                        </div>
                      )}
                      {student.status === "CANCELLED" && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Cancelled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 border border-dashed border-slate-100 rounded-xl bg-slate-50">
            <Users className="mx-auto h-8 w-8 text-slate-300" />
            <h4 className="font-heading text-xs font-bold text-slate-800 mt-2">No student records matches filter</h4>
          </div>
        )}
      </div>

    </div>
  );
}
