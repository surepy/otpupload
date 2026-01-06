import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from "$env/dynamic/private"
import { server } from '@passwordless-id/webauthn'

export const load: PageServerLoad = (_event) => {
    if (env.AUTHKEY_ID) {
        redirect(308, "/");
    }

	return { challenge: server.randomChallenge() };
};