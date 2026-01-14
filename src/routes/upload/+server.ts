import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as OTPAuth from "otpauth";
import { env } from "$env/dynamic/private"
import { writeFile } from 'fs/promises';
import { consumeToken } from '$lib/uploadtoken';
import { dev } from '$app/environment';

export const POST: RequestHandler = async ({ request }) => {
	const fromData = await request.formData();

	if (!fromData.has("auth")) {
		error(400);
	}

	let authenticated = consumeToken(<string>fromData.get("auth") ?? "");

	if (authenticated) {
		let written_files = [];

		for (let file of <File[]>fromData.getAll("files")) {
			
			await writeFile(
				dev ? `${env.UPLOAD_DIRECTORY}/${new Date().getTime()}_${file.name}` : `./static/uploads/${file.name}`, 
				//@ts-expect-error idc it works
				file.stream()
			);
			written_files.push(file.name);
		}

		return json({files: written_files});
	}

	error(401);
};