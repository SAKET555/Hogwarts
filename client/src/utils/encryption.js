import CryptoJS from 'crypto-js';

const SECRET_KEY = 'marauders_map_secret'; // In production, this should be a secure key exchange

export const encryptMessage = (message) => {
    return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
};

export const decryptMessage = (ciphertext) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        return '*** Encrypted Message ***';
    }
};
