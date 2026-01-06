// src/lib/uploadtoken.ts
// same impl as challanges, different purpose.

const challenges = new Map<string, number>();

export interface UploadTokenResponse {
    token: string 
};

function generateRandomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function createToken(): string {
    const challenge = generateRandomString(20);
    challenges.set(challenge, Date.now() + 7200000); // expires after 2 hours
    return challenge;
}

export function consumeToken(challenge: string): boolean {
    const expiry = challenges.get(challenge);
    if (!expiry || Date.now() > expiry) return false;
    challenges.delete(challenge); // one-time use
    return true;
}

export function cleanupStaleTokens() {
    const now = Date.now();
    for (const [c, exp] of challenges) if (now > exp) challenges.delete(c);
}