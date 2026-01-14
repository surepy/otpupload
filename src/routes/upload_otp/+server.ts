import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as OTPAuth from "otpauth";
import { getConfig } from '$lib/server/config';
import { createToken } from '$lib/uploadtoken';
import { dev } from '$app/environment';

export const POST: RequestHandler = async ({ request }) => {
	const config = getConfig();

	// Create a new TOTP object.
	let totp = new OTPAuth.TOTP({
		issuer: "otp-upload",
		algorithm: "SHA1",
		digits: 6,
		period: 30,
		secret: config.otpSecret,
	});

	let otp_request = await request.json();

	if (!otp_request || !otp_request.auth_otp ) {
		error(400, "no OTP token given");
	}

	let authenticated = totp.validate({ token: otp_request.auth_otp, window: config.totpWindow ?? 2 });

	if (dev) console.log(`requested code = ${otp_request.auth_otp} (should be ${totp.generate()}) auth = ${authenticated}`)

	if (typeof authenticated != null) {
		return json({token: createToken()});
	}

	error(401);
};