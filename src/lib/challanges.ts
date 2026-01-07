// src/lib/challenges.ts
import { server } from '@passwordless-id/webauthn'
const challenges = new Map<string, number>(); // challenge -> expiry timestamp

export function createChallenge(): string {
    const challenge = server.randomChallenge();
    challenges.set(challenge, Date.now() + 60000); // 60s expiry
    return challenge;
}

export function consumeChallenge(challenge: string): boolean {
    const expiry = challenges.get(challenge);
    if (!expiry || Date.now() > expiry) return false;
    challenges.delete(challenge); // one-time use
    return true;
}

export function cleanupStaleChallanges() {
    const now = Date.now();
    for (const [c, exp] of challenges) if (now > exp) challenges.delete(c);
}