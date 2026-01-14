import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from "$env/dynamic/private"
import { dev } from '$app/environment';
import { server } from '@passwordless-id/webauthn'
import type { AuthenticationResponseJSON, CollectedClientData, ExtendedAuthenticatorTransport, NamedAlgo } from '@passwordless-id/webauthn/dist/esm/types';
import { consumeChallenge } from '$lib/challanges';
import { createToken } from '$lib/uploadtoken';
import { getConfig } from '$lib/server/config';

export const POST: RequestHandler = async ({ request }) => {
	const config = getConfig();

	const credentialKey = {
		id: <string>config.authkeyId,
		publicKey: <string>config.authkeyPubkey,
		algorithm: config.authkeyAlgo as NamedAlgo,
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
		origin: (dev ? <string>config.appUrl : clientData.origin),
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