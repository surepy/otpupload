import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from "$env/dynamic/private"
import { writeFile } from 'fs/promises';

import { server } from '@passwordless-id/webauthn'
import type { AuthenticationResponseJSON, CollectedClientData, ExtendedAuthenticatorTransport, NamedAlgo } from '@passwordless-id/webauthn/dist/esm/types';
import { consumeChallenge } from '$lib/challanges';
import { createToken } from '$lib/uploadtoken';

export const POST: RequestHandler = async ({ request }) => {
	const credentialKey = {
		id: env.AUTHKEY_ID,
		publicKey: env.AUTHKEY_PUBKEY,
		algorithm: env.AUTHKEY_ALGO as NamedAlgo,
		transports: ["usb", "ble"] as ExtendedAuthenticatorTransport[]
	}

	const auth : AuthenticationResponseJSON = await request.json();

	if (!auth) {
		error(401);
	}
	
	const clientData: CollectedClientData = JSON.parse(atob(auth.response.clientDataJSON.replace(/-/g, '+').replace(/_/g, '/')));

	// replay attack prevention
	if (!consumeChallenge(clientData.challenge)) {
		error(401);
	}

	const expected = {
		challenge: clientData.challenge,
		// APP_URL must be correct in production.
		origin: env.NODE_ENV === "production" ? env.APP_URL : clientData.origin,
		userVerified: true
	}

	try {
		await server.verifyAuthentication(auth, credentialKey, expected);
		return json({token: createToken()});
	}
	catch {
		error(401);
	}
};