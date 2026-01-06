import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from "$env/dynamic/private"
import { writeFile } from 'fs/promises';

import { server } from '@passwordless-id/webauthn'
import type { AuthenticationResponseJSON, CollectedClientData, ExtendedAuthenticatorTransport, NamedAlgo } from '@passwordless-id/webauthn/dist/esm/types';
import { consumeChallenge } from '$lib/challanges';

export const POST: RequestHandler = async ({ request }) => {
	const credentialKey = {
		id: env.AUTHKEY_ID,
		publicKey: env.AUTHKEY_PUBKEY,
		algorithm: env.AUTHKEY_ALGO as NamedAlgo,
		transports: ["usb", "ble"] as ExtendedAuthenticatorTransport[]
	}

	const data = await request.formData();

	if (!data.has("auth_passkey")) {
		error(401);
	}

	const auth : AuthenticationResponseJSON = JSON.parse(<string>data.get("auth_passkey"));
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
	}
	catch {
		error(401);
	}

	if (!data.has("files")) {
		error(400);
	}

	let written_files = [];

	for (let file of <File[]>data.getAll("files")) {
		await writeFile(
			// yea
			env.NODE_ENV === "production" ? `${env.UPLOAD_DIRECTORY}/${new Date().getTime()}_${file.name}` : `./static/uploads/${file.name}`,
			//@ts-expect-error idc it works
			file.stream()
		);
		written_files.push(file.name);
	}

	return json({ files: written_files });
};