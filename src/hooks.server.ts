import { cleanupStaleChallanges } from '$lib/challanges';
import type { ServerInit } from '@sveltejs/kit';

export const init: ServerInit = async () => {
    setInterval(cleanupStaleChallanges, 60000);
};