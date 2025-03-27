import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from "$env/dynamic/private"


export const load: PageServerLoad = (_event) => {
    if (env.OTP_SECRET) {
        redirect(308, "/");
    }

	return {};
};