import apiClient from '@/utils/apiClient';

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
  formData.append('file', file);

  // axios automatically sets Content-Type: multipart/form-data with the correct boundary
  const res = await apiClient.post<UploadResult>('v1/AgencyApplication/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

/** Submit the completed agency application */
export async function submitAgencyApplication(
  payload: AgencyApplicationRequest
): Promise<{ id: number; referenceNumber: string }> {
  const res = await apiClient.post<{ id: number; referenceNumber: string }>(
    'v1/AgencyApplication/apply',
    payload
  );
  return res.data;
}
