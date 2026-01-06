import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as OTPAuth from "otpauth";
import { env } from "$env/dynamic/private"
import { writeFile } from 'fs/promises';
import { createToken } from '$lib/uploadtoken';

export const POST: RequestHandler = async ({ request }) => {
	// Create a new TOTP object.
	let totp = new OTPAuth.TOTP({
		// Provider or service the account is associated with.
		issuer: "otp-upload",
		// Algorithm used for the HMAC function, possible values are:
		//   "SHA1", "SHA224", "SHA256", "SHA384", "SHA512",
		//   "SHA3-224", "SHA3-256", "SHA3-384" and "SHA3-512".
		algorithm: "SHA1",
		// Length of the generated tokens.
		digits: 6,
		// Interval of time for which a token is valid, in seconds.
		period: 30,
		// Arbitrary key encoded in base32 or `OTPAuth.Secret` instance
		// (if omitted, a cryptographically secure random secret is generated).
		secret: env.OTP_SECRET,
		//   or: `OTPAuth.Secret.fromBase32("US3WHSG7X5KAPV27VANWKQHF3SH3HULL")`
		//   or: `new OTPAuth.Secret()`
	});

	let otp_request = await request.json();

	// == "undefined" is kinda dumb but hey it works
	if (!otp_request || !otp_request.auth_otp ) {
		error(400, "no OTP token given");
	}

	let authenticated = totp.validate({ token: otp_request.auth_otp, window: parseInt(env.TOTP_WINDOW) ?? 10});

	if (authenticated) {
		return json({token: createToken()});
	}

	error(401);
};