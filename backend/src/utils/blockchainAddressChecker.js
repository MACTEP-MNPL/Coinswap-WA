/**
 * Blockchain Address Validation Utilities
 * Functions to validate different blockchain address formats
 */

/**
 * Validates BEP20 (Binance Smart Chain) address
 * BEP20 addresses follow Ethereum address format: 0x followed by 40 hexadecimal characters
 * @param {string} address - The address string to validate
 * @returns {boolean} - True if valid BEP20 address, false otherwise
 */
export const isBEP20Address = (address) => {
    if (typeof address !== 'string') {
        return false;
    }
    
    // BEP20 addresses are 42 characters long, start with 0x, followed by 40 hex characters
    const bep20Regex = /^0x[a-fA-F0-9]{40}$/;
    return bep20Regex.test(address);
}

/**
 * Validates TRC20 (Tron) address
 * TRC20 addresses are base58 encoded, start with 'T', and are 34 characters long
 * @param {string} address - The address string to validate
 * @returns {boolean} - True if valid TRC20 address, false otherwise
 */
export const isTRC20Address = (address) => {
    if (typeof address !== 'string') {
        return false;
    }
    
    // TRC20 addresses start with 'T' and are 34 characters long
    // They use base58 encoding (no 0, O, I, l characters)
    const trc20Regex = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;
    
    if (!trc20Regex.test(address)) {
        return false;
    }
    
    // Additional validation: check if it's a valid base58 string
    const base58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    for (let char of address.slice(1)) { // Skip the 'T' prefix
        if (!base58Chars.includes(char)) {
            return false;
        }
    }
    
    return true;
}

/**
 * Validates TON (The Open Network) address
 * TON addresses can be in user-friendly format (base64url encoded) or raw format
 * User-friendly format: workchain:account_id or EQD... format
 * @param {string} address - The address string to validate
 * @returns {boolean} - True if valid TON address, false otherwise
 */
export const isTONAddress = (address) => {
    if (typeof address !== 'string') {
        return false;
    }
    
    // Remove any whitespace
    address = address.trim();
    
    // Check for raw format: workchain:account_id (e.g., "0:83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8")
    const rawFormatRegex = /^-?[0-9]+:[a-fA-F0-9]{64}$/;
    if (rawFormatRegex.test(address)) {
        return true;
    }
    
    // Check for user-friendly format (base64url encoded, typically starts with EQ, UQ, or similar)
    // These are 48 characters long and base64url encoded
    const userFriendlyRegex = /^[A-Za-z0-9_-]{48}$/;
    if (userFriendlyRegex.test(address)) {
        // Additional validation: check if it's valid base64url
        const base64urlChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
        for (let char of address) {
            if (!base64urlChars.includes(char)) {
                return false;
            }
        }
        return true;
    }
    
    return false;
}

/**
 * General function to validate any of the supported blockchain addresses
 * @param {string} address - The address string to validate
 * @param {string} type - The blockchain type ('BEP20', 'TRC20', 'TON')
 * @returns {boolean} - True if valid address for the specified type, false otherwise
 */
export const isValidBlockchainAddress = (address, type) => {
    if (typeof address !== 'string' || typeof type !== 'string') {
        return false;
    }
    
    const normalizedType = type.toUpperCase();
    
    switch (normalizedType) {
        case 'BEP20':
            return isBEP20Address(address);
        case 'TRC20':
            return isTRC20Address(address);
        case 'TON':
            return isTONAddress(address);
        default:
            return false;
    }
}
