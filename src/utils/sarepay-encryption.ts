import CryptoJS from 'crypto-js';

// Get these from env variables in a real scenario
const SAREPAY_ENCRYPTION_KEY = import.meta.env?.VITE_SAREPAY_ENCRYPTION_KEY || 'A9258780C4EFDE81116C0ADD32B2B75D';
const SAREPAY_IV = import.meta.env?.VITE_SAREPAY_IV || '4782708966677718';

/**
 * Encrypts card data for SarePay.
 * 
 * Our method of choice is AES-256 encryption, CBC mode, and base64 output format.
 * Concatenate the values using empty spaces as separators and then proceed to encrypt the concatenated string.
 * "pan cvv expiry_month expiry_year"
 * 
 * @param pan Card PAN
 * @param cvv Card CVV
 * @param expiryMonth Expiry Month
 * @param expiryYear Expiry Year
 * @returns Base64 string of the AES-256 encrypted payload
 */
export const encryptCardData = (pan: string, cvv: string, expiryMonth: string, expiryYear: string): string => {
    try {
        const payload = `${pan} ${cvv} ${expiryMonth} ${expiryYear}`;

        // Ensure keys and IV are properly parsed as Utf8
        const key = CryptoJS.enc.Utf8.parse(SAREPAY_ENCRYPTION_KEY);
        const iv = CryptoJS.enc.Utf8.parse(SAREPAY_IV);

        const encrypted = CryptoJS.AES.encrypt(payload, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7, // PKCS7 is standard and mostly what gateways expect
        });

        // The result is an object, `.toString()` outputs base64 string directly
        return encrypted.toString();
    } catch (error) {
        console.error('Error encrypting SarePay card data', error);
        throw new Error('Failed to encrypt card details.');
    }
};

/**
 * Encrypts PIN for SarePay submission.
 * 
 * @param pin The PIN from the user
 * @returns Base64 string of the AES-256 encrypted PIN
 */
export const encryptPin = (pin: string): string => {
    try {
        const key = CryptoJS.enc.Utf8.parse(SAREPAY_ENCRYPTION_KEY);
        const iv = CryptoJS.enc.Utf8.parse(SAREPAY_IV);

        const encrypted = CryptoJS.AES.encrypt(pin, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return encrypted.toString();
    } catch (error) {
        console.error('Error encrypting SarePay PIN', error);
        throw new Error('Failed to encrypt PIN.');
    }
};
