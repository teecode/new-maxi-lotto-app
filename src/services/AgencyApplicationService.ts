const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export interface AgencyApplicationRequest {
  // Section 1 – Personal Details
  fullName: string;
  dateOfBirth: string; // ISO date string
  gender: number; // 1=Male, 2=Female, 3=PreferNotToSay
  phoneNumber: string;
  whatsappNumber: string;
  emailAddress: string;
  residentialAddress: string;

  // Section 2 – KYC
  nin: string;
  bvn: string;
  idType: number; // 1=DriversLicense, 2=VotersCard, 3=InternationalPassport
  idNumber: string;
  idDocumentUrl: string;
  passportPhotoUrl: string;
  utilityBillUrl: string;

  // Section 3 – Business
  proposedAgencyName: string;
  shopBusinessAddress: string;
  lga: string;
  state: string; // state code e.g. "DT"
  preferredSalesTerritory: string;
  yearsOfExperience: number;

  // Section 4 – Banking
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface UploadResult {
  url: string;
  publicId: string;
}

/** Upload a file via the backend Cloudinary proxy and return the URL */
export async function uploadFile(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}api/v1/AgencyApplication/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "File upload failed");
  }
  return res.json();
}

/** Submit the completed agency application */
export async function submitAgencyApplication(
  payload: AgencyApplicationRequest
): Promise<{ id: number; referenceNumber: string }> {
  const res = await fetch(`${API_BASE}api/v1/AgencyApplication/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as any).message ?? "Submission failed. Please try again.");
  }
  return res.json();
}
