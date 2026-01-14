import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getConfig, saveConfig } from '$lib/server/config';

export const load: PageServerLoad = (_event) => {
	const config = getConfig();
	if (config.otpSecret) {
		redirect(308, "/");
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const otpSecret = formData.get('otpSecret');

		if (!otpSecret || typeof otpSecret !== 'string') {
			return fail(400, { error: 'Missing OTP secret' });
		}
		console.log("OTP setup complete.");

		saveConfig({ otpSecret });
		redirect(303, "/");
	}
};
