import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { OTP_SECRET } from "$env/static/private"


export const load: PageServerLoad = (_event) => {
    if (OTP_SECRET) {
        redirect(308, "/");
    }

	return {};
};