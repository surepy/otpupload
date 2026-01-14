<script lang="ts">
    import { Label, Button, Progressbar } from "flowbite-svelte";
    import { Input } from "flowbite-svelte";
    import { Alert } from "flowbite-svelte";
    import FileDropzone from "$lib/FileDropzone.svelte";
    import type { PageProps } from "./$types";
    import { client } from "@passwordless-id/webauthn";
    import type { UploadTokenResponse } from "$lib/uploadtoken";
    import { tick } from "svelte";

    let files: File[] = $state([]);
    let password: string = $state("");
    let request: Promise<Response> | null = $state(null);
    let request_auth: Promise<Response> | null = $state(null);

    let uploadProgress: number = $state(0);

    async function upload(auth: string) {
        //
        request_auth = null;

        let formData = new FormData();

        formData.append("auth", auth);

        for (let file of files) {
            formData.append("files", file, file.name);
        }

        request = new Promise<Response>((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    uploadProgress = (event.loaded / event.total) * 100;
                }
            };

            xhr.onload = () => {
                resolve(
                    new Response(xhr.response, {
                        status: xhr.status,
                        statusText: xhr.statusText,
                    }),
                );
                files = [];
            };

            xhr.onerror = () => reject(new Error("Upload failed"));
            xhr.open("POST", "/upload");
            xhr.send(formData);
        });
    }

    async function upload_otp() {
        if (files.length < 1) {
            console.log("no files supplied");
            return;
        }

        request_auth = fetch("/upload_otp", {
            method: "post",
            body: JSON.stringify({
                auth_otp: password,
            }),
        });

        let auth_response: UploadTokenResponse = await (
            await request_auth
        ).json();

        
        if (auth_response.token)
            await upload(auth_response.token);
    }

    // https://webauthn.passwordless.id/authentication/
    async function upload_passkeys() {
        // TODO: error on the page
        if (files.length < 1) {
            console.log("no files supplied");
            return;
        }

        let challenge_request: { challenge: string } = await (
            await fetch("/challenge")
        ).json();

        const auth = await client.authenticate({
            challenge: challenge_request.challenge,
        });

        request_auth = fetch("/upload_passkeys", {
            method: "post",
            body: JSON.stringify(auth),
        });

        let auth_response: UploadTokenResponse = await (
            await request_auth
        ).json();

        if (auth_response.token)
            await upload(auth_response.token);
    }
</script>

<h1 class="dark:text-gray-200 text-3xl mb-1 font-medium">OTP-Upload</h1>

<p class="dark:text-gray-200 mb-5 text-sm font-light">
    <i>(because logging in for a single file sucks)</i>
</p>

<div class="w-full max-w-lg">
    {#if request && !request_auth}
        {#await request}
            <Alert class="mb-5" color="blue">
                <p class="font-bold mb-3">Authenticated! Uploading...</p>
                <Progressbar progress={uploadProgress} />
            </Alert>
        {:then res_req: Response}
            {#await res_req.json() then body}
                {#if res_req.ok}
                    <Alert class="font-bold mb-5" color="blue">
                        Uploaded {body.files.length} file(s)
                    </Alert>
                {:else}
                    <Alert class="mb-5 font-bold text-left">
                        {body.message}
                    </Alert>
                {/if}
            {:catch _}
                <Alert class="mb-5" color="red">
                    <p class="font-bold">Request Failure!</p>
                </Alert>
            {/await}
        {/await}
    {:else if request_auth}
        {#await request_auth}
            <Alert class="mb-5" color="yellow">
                <p class="font-bold">Authenticating...</p>
            </Alert>
        {:then auth_response}
            {#if !auth_response?.ok}
                <Alert class="mb-5" color="red">
                    <p class="font-bold">Authentication Failure!</p>
                </Alert>
            {/if}
        {/await}
    {/if}

    <Label class="text-left pb-1">Password</Label>
    <Input
        bind:value={password}
        class="mb-2"
        id="otp-password"
        placeholder="000000"
        inputmode="numeric"
        pattern="[0-9]*"
    />

    <Label class="pb-1 text-left">Upload Files</Label>

    <FileDropzone bind:files />

    <Button class="min-w-30 max-w-1/2 w-full mt-6" onclick={upload_otp}
        >Upload</Button
    >

    <Button class="min-w-30 max-w-1/2 w-full mt-4" onclick={upload_passkeys}
        >Upload w/ Passkeys</Button
    >
</div>
