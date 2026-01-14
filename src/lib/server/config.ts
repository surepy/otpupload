import { readFileSync, writeFileSync, existsSync } from 'fs';
import { env } from '$env/dynamic/private';

const CONFIG_PATH = './config.json';

let cachedConfig: Config | null = null;

export interface PasskeyInstance {
	authkeyId?: string;
	authkeyPubkey?: string;
	authkeyAlgo?: string;
}

export interface Config {
	otpSecret?: string;
	totpWindow?: number;

	// TODO move authkeyID to [0]
	passkeys? : Map<string, PasskeyInstance>;

	authkeyId?: string;
	authkeyPubkey?: string;
	authkeyAlgo?: string;
	appUrl?: string;
	uploadDirectory?: string;
}

function readConfigFile(): Config {
	if (!existsSync(CONFIG_PATH)) {
		console.warn("Config File Missing!");
		return {};
	}
	try {
		return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
	} catch {
		return {};
	}
}

export function getConfig(): Config {
	if (cachedConfig) {
		return cachedConfig;
	}

	const fileConfig = readConfigFile();

	// Env vars override/append to file config
	cachedConfig = {
		otpSecret: env.OTP_SECRET ?? fileConfig.otpSecret,
		totpWindow: env.TOTP_WINDOW ? parseInt(env.TOTP_WINDOW) : fileConfig.totpWindow ?? 10,
		authkeyId: env.AUTHKEY_ID ?? fileConfig.authkeyId,
		authkeyPubkey: env.AUTHKEY_PUBKEY ?? fileConfig.authkeyPubkey,
		authkeyAlgo: env.AUTHKEY_ALGO ?? fileConfig.authkeyAlgo,
		appUrl: env.APP_URL ?? fileConfig.appUrl,
		uploadDirectory: env.UPLOAD_DIRECTORY ?? fileConfig.uploadDirectory ?? './uploads'
	};

	return cachedConfig;
}

export function saveConfig(partial: Partial<Config>): void {
	const existing = readConfigFile();
	const merged = { ...existing, ...partial };
	writeFileSync(CONFIG_PATH, JSON.stringify(merged, null, 2));
	// Invalidate cache so next getConfig() reloads
	cachedConfig = null;
}
