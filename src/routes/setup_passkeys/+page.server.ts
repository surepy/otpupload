import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getConfig, saveConfig } from '$lib/server/config';
import { server } from '@passwordless-id/webauthn';
import { consumeChallenge, createChallenge } from '$lib/challanges';
import { dev } from '$app/environment';
import type { CollectedClientData, RegistrationJSON } from '@passwordless-id/webauthn/dist/esm/types';

export const load: PageServerLoad = (_event) => {
	const config = getConfig();
	if (config.authkeyId) {
		redirect(308, "/");
	}

	return { challenge: createChallenge() };
};

export const actions: Actions = {
	default: async ({ request }) => {	
		const config = getConfig();

		const formData = await request.formData();
		const registration: RegistrationJSON = JSON.parse(<string>formData.get('registration'));

		const clientData: CollectedClientData = JSON.parse(atob(registration.response.clientDataJSON.replace(/-/g, '+').replace(/_/g, '/')));

		// replay attack prevention
		if (!consumeChallenge(clientData.challenge)) {
			return fail(400, { error: 'Invalid Challange' });
		}

		const expected = {
			challenge: clientData.challenge,
			// APP_URL must be correct in production.
			origin: dev ? <string>config.appUrl : clientData.origin
		}

		const registrationParsed = await server.verifyRegistration(registration, expected);

		console.log("passkey setup complete.");

		saveConfig({ authkeyId: registrationParsed.credential.id, authkeyPubkey: registrationParsed.credential.publicKey, authkeyAlgo: registrationParsed.credential.algorithm });
		redirect(303, "/");
	}
};
