import React, { useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { NIGERIA_STATES, getLgasByStateCode } from "@/constants/nigeria-lgas";
import {
  uploadFile,
  submitAgencyApplication,
  type AgencyApplicationRequest,
} from "@/services/AgencyApplicationService";
import {
  CheckCircle2,
  Upload,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useFetchBanks } from "@/hooks/useUserProfile";
import { resolveAccountDetails } from "@/services/UserService";
import { toast } from "sonner";

export const Route = createFileRoute("/_layout/become-an-agent")({
  component: BecomeAnAgent,
});

const STEPS = [
  { id: 1, label: "Personal Details" },
  { id: 2, label: "KYC / Identity" },
  { id: 3, label: "Business Details" },
  { id: 4, label: "Banking" },
];

const ID_TYPES = [
  { value: "1", label: "Driver's License" },
  { value: "2", label: "Voter's Card" },
  { value: "3", label: "International Passport" },
];

const GENDER_OPTIONS = [
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
  { value: "3", label: "Prefer not to say" },
];

interface FormData {
  // Step 1
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  whatsappNumber: string;
  emailAddress: string;
  residentialAddress: string;
  // Step 2
  nin: string;
  bvn: string;
  idType: string;
  idNumber: string;
  idDocumentFile: File | null;
  idDocumentUrl: string;
  passportPhotoFile: File | null;
  passportPhotoUrl: string;
  utilityBillFile: File | null;
  utilityBillUrl: string;
  // Step 3
  proposedAgencyName: string;
  shopBusinessAddress: string;
  stateCode: string;
  lga: string;
  preferredSalesTerritory: string;
  yearsOfExperience: string;
  // Step 4
  bankId: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
}

const initialForm: FormData = {
  fullName: "",
  dateOfBirth: "",
  gender: "",
  phoneNumber: "",
  whatsappNumber: "",
  emailAddress: "",
  residentialAddress: "",
  nin: "",
  bvn: "",
  idType: "",
  idNumber: "",
  idDocumentFile: null,
  idDocumentUrl: "",
  passportPhotoFile: null,
  passportPhotoUrl: "",
  utilityBillFile: null,
  utilityBillUrl: "",
  proposedAgencyName: "",
  shopBusinessAddress: "",
  stateCode: "",
  lga: "",
  preferredSalesTerritory: "",
  yearsOfExperience: "",
  bankId: 0,
  bankName: "",
  accountName: "",
  accountNumber: "",
};

// ────────────────────────────────────────────────────────────────────────────────
// File Upload Row
// ────────────────────────────────────────────────────────────────────────────────
function FileUploadField({
  label,
  required,
  accept,
  file,
  uploading,
  uploaded,
  onFileChange,
}: {
  label: string;
  required?: boolean;
  accept: string;
  file: File | null;
  uploading: boolean;
  uploaded: boolean;
  onFileChange: (file: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <p className="text-xs text-muted-foreground">
        Upload 1 supported file: PDF or image. Max 10 MB.
      </p>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => ref.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? "Uploading…" : "Add file"}
        </Button>
        {uploaded && (
          <span className="flex items-center gap-1 text-xs text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            {file?.name ?? "Uploaded"}
          </span>
        )}
        {!uploaded && file && !uploading && (
          <span className="text-xs text-muted-foreground">{file.name}</span>
        )}
        <input
          ref={ref}
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFileChange(f);
          }}
        />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────────────────────────────────
export default function BecomeAnAgent() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadError, setUploadError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState<{ id: number; referenceNumber: string } | null>(null);

  const { data: banks, isFetching: isBanksFetching } = useFetchBanks();
  const [validatingAccount, setValidatingAccount] = useState(false);

  const lgas = getLgasByStateCode(form.stateCode);

  const set = (key: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // ── File upload helper
  async function handleFileUpload(
    fileKey: "idDocumentFile" | "passportPhotoFile" | "utilityBillFile",
    urlKey: "idDocumentUrl" | "passportPhotoUrl" | "utilityBillUrl",
    file: File
  ) {
    setUploadError("");
    set(fileKey, file);
    setUploading((p) => ({ ...p, [fileKey]: true }));
    try {
      const res = await uploadFile(file);
      set(urlKey, res.url);
    } catch (e: any) {
      setUploadError(e.message ?? "File upload failed");
    } finally {
      setUploading((p) => ({ ...p, [fileKey]: false }));
    }
  }

  const handleAccountNumberChange = async (value: string) => {
    set("accountNumber", value);
    if (value.length === 10 && form.bankId) {
      try {
        setValidatingAccount(true);
        const { account_name } = await resolveAccountDetails(value, form.bankId);
        set("accountName", account_name);
        toast.success("Account verified successfully");
      } catch (error: any) {
        toast.error(error.message || "Account validation failed");
        set("accountName", "");
      } finally {
        setValidatingAccount(false);
      }
    } else {
      set("accountName", "");
    }
  };

  // ── Validation per step
  function validateStep(s: number): boolean {
    const errs: typeof errors = {};
    if (s === 1) {
      if (!form.fullName.trim()) errs.fullName = "Full name is required";
      if (!form.dateOfBirth) errs.dateOfBirth = "Date of birth is required";
      if (!form.gender) errs.gender = "Gender is required";
      if (!form.phoneNumber.trim()) errs.phoneNumber = "Phone number is required";
      if (!form.whatsappNumber.trim()) errs.whatsappNumber = "WhatsApp number is required";
      if (!form.emailAddress.trim()) errs.emailAddress = "Email is required";
      if (!form.residentialAddress.trim()) errs.residentialAddress = "Address is required";
    }
    if (s === 2) {
      if (!form.nin.trim()) errs.nin = "NIN is required";
      if (!form.bvn.trim()) errs.bvn = "BVN is required";
      if (!form.idType) errs.idType = "ID type is required";
      if (!form.idDocumentUrl) errs.idDocumentUrl = "Please upload your ID document";
      if (!form.passportPhotoUrl) errs.passportPhotoUrl = "Please upload your passport photo";
      if (!form.utilityBillUrl) errs.utilityBillUrl = "Please upload your utility bill";
    }
    if (s === 3) {
      if (!form.proposedAgencyName.trim()) errs.proposedAgencyName = "Agency name is required";
      if (!form.shopBusinessAddress.trim()) errs.shopBusinessAddress = "Business address is required";
      if (!form.stateCode) errs.stateCode = "State is required";
      if (!form.lga) errs.lga = "LGA is required";
      if (!form.preferredSalesTerritory.trim()) errs.preferredSalesTerritory = "Sales territory is required";
      if (!form.yearsOfExperience) errs.yearsOfExperience = "Years of experience is required";
    }
    if (s === 4) {
      if (!form.bankName.trim()) errs.bankName = "Bank name is required";
      if (!form.accountName.trim()) errs.accountName = "Account name is required";
      if (!form.accountNumber.trim()) errs.accountNumber = "Account number is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 4));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(4)) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const payload: AgencyApplicationRequest = {
        fullName: form.fullName,
        dateOfBirth: form.dateOfBirth,
        gender: parseInt(form.gender),
        phoneNumber: form.phoneNumber,
        whatsappNumber: form.whatsappNumber,
        emailAddress: form.emailAddress,
        residentialAddress: form.residentialAddress,
        nin: form.nin,
        bvn: form.bvn,
        idType: parseInt(form.idType),
        idNumber: form.idNumber,
        idDocumentUrl: form.idDocumentUrl,
        passportPhotoUrl: form.passportPhotoUrl,
        utilityBillUrl: form.utilityBillUrl,
        proposedAgencyName: form.proposedAgencyName,
        shopBusinessAddress: form.shopBusinessAddress,
        lga: form.lga,
        state: form.stateCode,
        preferredSalesTerritory: form.preferredSalesTerritory,
        yearsOfExperience: parseInt(form.yearsOfExperience) || 0,
        bankName: form.bankName,
        accountName: form.accountName,
        accountNumber: form.accountNumber,
      };
      const res = await submitAgencyApplication(payload);
      setSuccess(res);
    } catch (e: any) {
      setSubmitError(e.message ?? "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 pt-24 pb-16">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center space-y-6">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Application Submitted!</h2>
          <p className="text-gray-600">
            Your agency application has been received. Our team will review it and
            contact you within 3–5 business days.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 space-y-1">
            <p className="text-sm text-gray-500">Reference Number</p>
            <p className="font-bold text-lg text-[#0f172a]">{success.referenceNumber}</p>
          </div>
          <p className="text-xs text-gray-400">
            Save your reference number for follow-up inquiries.
          </p>
          <Button
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-3xl"
            onClick={() => (window.location.href = "/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] px-4 pt-24 pb-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Become a{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Maxilotto Agent
            </span>
          </h1>
          <p className="text-gray-400">
            Earn up to 35% commission on every ticket sold.{" "}
            <span className="text-xs text-gray-500">Terms and conditions apply.</span>
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute inset-x-0 top-4 h-0.5 bg-white/10" />
          {STEPS.map((s) => (
            <div key={s.id} className="relative flex flex-col items-center gap-2 flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold z-10 transition-all",
                  step > s.id
                    ? "bg-emerald-500 text-white"
                    : step === s.id
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white ring-4 ring-pink-500/30"
                    : "bg-white/10 text-gray-400"
                )}
              >
                {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
              </div>
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-medium text-center hidden sm:block",
                  step === s.id ? "text-white" : "text-gray-500"
                )}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Step header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <h2 className="text-white font-semibold text-lg">
                Section {step}: {STEPS[step - 1].label}
              </h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ─── STEP 1 ─── */}
              {step === 1 && (
                <>
                  <Field label="Full Name" required error={errors.fullName}>
                    <Input
                      value={form.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                      placeholder="Your full name"
                    />
                  </Field>
                  <Field label="Date of Birth" required error={errors.dateOfBirth}>
                    <Input
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) => set("dateOfBirth", e.target.value)}
                    />
                  </Field>
                  <Field label="Gender" required error={errors.gender}>
                    <RadioGroup
                      value={form.gender}
                      onValueChange={(v) => set("gender", v)}
                      className="flex flex-col gap-2"
                    >
                      {GENDER_OPTIONS.map((g) => (
                        <div key={g.value} className="flex items-center gap-2">
                          <RadioGroupItem value={g.value} id={`gender-${g.value}`} />
                          <Label htmlFor={`gender-${g.value}`} className="cursor-pointer">
                            {g.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </Field>
                  <Field label="Phone Number" required error={errors.phoneNumber}>
                    <Input
                      value={form.phoneNumber}
                      onChange={(e) => set("phoneNumber", e.target.value)}
                      placeholder="e.g. 08012345678"
                    />
                  </Field>
                  <Field label="WhatsApp Number" required error={errors.whatsappNumber}>
                    <Input
                      value={form.whatsappNumber}
                      onChange={(e) => set("whatsappNumber", e.target.value)}
                      placeholder="e.g. 08012345678"
                    />
                  </Field>
                  <Field label="Email Address" required error={errors.emailAddress}>
                    <Input
                      type="email"
                      value={form.emailAddress}
                      onChange={(e) => set("emailAddress", e.target.value)}
                      placeholder="you@example.com"
                    />
                  </Field>
                  <Field label="Residential Address" required error={errors.residentialAddress} className="md:col-span-2">
                    <Input
                      value={form.residentialAddress}
                      onChange={(e) => set("residentialAddress", e.target.value)}
                      placeholder="Your home address"
                    />
                  </Field>
                </>
              )}

              {/* ─── STEP 2 ─── */}
              {step === 2 && (
                <>
                  <Field label="NIN (National Identification Number)" required error={errors.nin}>
                    <Input
                      value={form.nin}
                      onChange={(e) => set("nin", e.target.value)}
                      placeholder="Your 11-digit NIN"
                      maxLength={11}
                    />
                  </Field>
                  <Field label="BVN (Bank Verification Number)" required error={errors.bvn}>
                    <Input
                      value={form.bvn}
                      onChange={(e) => set("bvn", e.target.value)}
                      placeholder="Your 11-digit BVN"
                      maxLength={11}
                    />
                  </Field>
                  <Field label="ID Type" required error={errors.idType}>
                    <Select value={form.idType} onValueChange={(v) => set("idType", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ID_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="ID Number" error={errors.idNumber}>
                    <Input
                      value={form.idNumber}
                      onChange={(e) => set("idNumber", e.target.value)}
                      placeholder="ID document number"
                    />
                  </Field>

                  {/* File uploads */}
                  <Field label="" error={errors.idDocumentUrl} className="md:col-span-2">
                    <FileUploadField
                      label="Upload ID"
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      file={form.idDocumentFile}
                      uploading={!!uploading.idDocumentFile}
                      uploaded={!!form.idDocumentUrl}
                      onFileChange={(f) =>
                        handleFileUpload("idDocumentFile", "idDocumentUrl", f)
                      }
                    />
                  </Field>
                  <Field label="" error={errors.passportPhotoUrl} className="md:col-span-2">
                    <FileUploadField
                      label="Upload Passport Photograph"
                      required
                      accept=".jpg,.jpeg,.png,.pdf"
                      file={form.passportPhotoFile}
                      uploading={!!uploading.passportPhotoFile}
                      uploaded={!!form.passportPhotoUrl}
                      onFileChange={(f) =>
                        handleFileUpload("passportPhotoFile", "passportPhotoUrl", f)
                      }
                    />
                  </Field>
                  <Field label="" error={errors.utilityBillUrl} className="md:col-span-2">
                    <FileUploadField
                      label="Upload Utility Bill"
                      required
                      accept=".jpg,.jpeg,.png,.pdf"
                      file={form.utilityBillFile}
                      uploading={!!uploading.utilityBillFile}
                      uploaded={!!form.utilityBillUrl}
                      onFileChange={(f) =>
                        handleFileUpload("utilityBillFile", "utilityBillUrl", f)
                      }
                    />
                  </Field>

                  {uploadError && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {uploadError}
                    </div>
                  )}
                </>
              )}

              {/* ─── STEP 3 ─── */}
              {step === 3 && (
                <>
                  <Field
                    label="Proposed Agency Name"
                    required
                    error={errors.proposedAgencyName}
                    className="md:col-span-2"
                  >
                    <Input
                      value={form.proposedAgencyName}
                      onChange={(e) => set("proposedAgencyName", e.target.value)}
                      placeholder="Your agency trade name"
                    />
                  </Field>
                  <Field
                    label="Shop / Business Address"
                    required
                    error={errors.shopBusinessAddress}
                    className="md:col-span-2"
                  >
                    <Input
                      value={form.shopBusinessAddress}
                      onChange={(e) => set("shopBusinessAddress", e.target.value)}
                      placeholder="Physical business address"
                    />
                  </Field>

                  {/* State */}
                  <Field label="State" required error={errors.stateCode}>
                    <Select
                      value={form.stateCode}
                      onValueChange={(v) => {
                        set("stateCode", v);
                        set("lga", "");
                        set(
                          "preferredSalesTerritory",
                          NIGERIA_STATES.find((s) => s.code === v)?.name ?? ""
                        );
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Only active states are selectable */}
                        {NIGERIA_STATES.filter((s) => s.active).map((s) => (
                          <SelectItem key={s.code} value={s.code}>
                            {s.name}
                          </SelectItem>
                        ))}
                        {/* Inactive states shown as disabled */}
                        {/* Uncomment below and add more states as licensing expands */}
                        {/* {NIGERIA_STATES.filter((s) => !s.active).map((s) => (
                          <SelectItem key={s.code} value={s.code} disabled>
                            {s.name} (coming soon)
                          </SelectItem>
                        ))} */}
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* LGA – loaded from state */}
                  <Field label="LGA" required error={errors.lga}>
                    <Select
                      value={form.lga}
                      onValueChange={(v) => set("lga", v)}
                      disabled={!form.stateCode}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            form.stateCode ? "Select LGA" : "Select a state first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {lgas.map((lga) => (
                          <SelectItem key={lga} value={lga}>
                            {lga}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field
                    label="Preferred Sales Territory"
                    required
                    error={errors.preferredSalesTerritory}
                  >
                    <Input
                      value={form.preferredSalesTerritory}
                      onChange={(e) => set("preferredSalesTerritory", e.target.value)}
                      placeholder="e.g. Delta"
                    />
                  </Field>
                  <Field
                    label="Years of Gaming / Sales Experience"
                    required
                    error={errors.yearsOfExperience}
                  >
                    <Input
                      type="number"
                      min="0"
                      max="50"
                      value={form.yearsOfExperience}
                      onChange={(e) => set("yearsOfExperience", e.target.value)}
                      placeholder="e.g. 2"
                    />
                  </Field>
                </>
              )}

              {/* ─── STEP 4 ─── */}
              {step === 4 && (
                <>
                  <Field label="Bank Name" required error={errors.bankName}>
                    <Select
                      value={form.bankId ? String(form.bankId) : ""}
                      onValueChange={(v) => {
                        const bank = banks?.find((b) => String(b.id) === v);
                        set("bankId", Number(v));
                        set("bankName", bank?.name ?? "");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isBanksFetching ? "Loading banks..." : "Select bank"} />
                      </SelectTrigger>
                      <SelectContent>
                        {banks?.map((bank) => (
                          <SelectItem key={bank.id} value={String(bank.id)}>
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Account Number" required error={errors.accountNumber}>
                    <Input
                      value={form.accountNumber}
                      onChange={(e) => handleAccountNumberChange(e.target.value)}
                      placeholder="10-digit account number"
                      maxLength={10}
                      disabled={!form.bankId || validatingAccount}
                    />
                  </Field>
                  <Field label="Account Name" required error={errors.accountName} className="md:col-span-2">
                    <Input
                      value={form.accountName}
                      readOnly
                      placeholder={validatingAccount ? "Validating account..." : "Account holder name"}
                    />
                  </Field>

                  {submitError && (
                    <div className="md:col-span-2 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      {submitError}
                    </div>
                  )}

                  <div className="md:col-span-2 text-xs text-gray-500 border rounded-lg p-3 bg-gray-50">
                    By submitting this application you agree to our{" "}
                    <a
                      href="/terms-and-condition"
                      className="text-indigo-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms and Conditions
                    </a>
                    . This application is subject to review and approval.
                  </div>
                </>
              )}
            </div>

            {/* Footer nav */}
            <div className="px-6 pb-6 flex items-center justify-between gap-3">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={back}
                  className="gap-2"
                  disabled={submitting}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <Button
                  type="button"
                  onClick={next}
                  className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-3xl"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={submitting}
                  className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl min-w-[140px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Tiny helper for labelled field with error
function Field({
  label,
  required,
  error,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
