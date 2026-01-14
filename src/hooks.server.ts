import { cleanupStaleChallanges } from '$lib/challanges';
import { getConfig } from '$lib/server/config';
import type { ServerInit } from '@sveltejs/kit';

export const init: ServerInit = async () => {
    setInterval(cleanupStaleChallanges, 60000);
    // pre-cache our config
    getConfig();
};