<script lang="ts">
    import { Label, Button, Progressbar } from "flowbite-svelte";
    import { Input } from "flowbite-svelte";
    import { Alert } from "flowbite-svelte";
    import FileDropzone from "$lib/FileDropzone.svelte";
    import type { PageProps } from "./$types";
    import { client } from "@passwordless-id/webauthn";

    let files: File[] = $state([]);
    let password: string = $state("");
    let request: Promise<Response> | null = $state(null);

    async function upload(target: string, formData : FormData) {
        for (let file of files) {
            formData.append("files", file, file.name);
        }

        const xhr = new XMLHttpRequest();
        xhr.open("POST", target);
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = (event.loaded / event.total) * 100;
                console.log(`Upload progress: ${percent.toFixed(2)}%`);
            }
        };
        xhr.onload = () => {
            console.log("Upload complete")
            // json parse
            console.log(xhr.responseText);
        };
        xhr.onerror = () => console.error("Upload failed");
        xhr.send(formData);
        
        files = [];
    }

    async function upload_otp() {
        if (files.length < 1) {
            console.log("no files supplied");
            return;
        }

        let data = new FormData();
        data.append("auth_otp", password);
        await upload("/upload", data);
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

        let data = new FormData();
        data.append("auth_passkey", JSON.stringify(auth));
        await upload("/upload_passkeys", data);
    }
</script>

<h1 class="dark:text-gray-200 text-3xl mb-1 font-medium">OTP-Upload</h1>

<p class="dark:text-gray-200 mb-5 text-sm font-light">
    <i>(because logging in for a single file sucks)</i>
</p>

<div class="w-full max-w-lg">
    {#if request}
        {#await request}
            <Alert class="mb-5" color="blue">
                <p class="font-bold mb-2">Uploading...</p>
                <!--<Progressbar progress="100" />-->
            </Alert>
        {:then res_req: Response}
            {#await res_req.json() then body}
                {#if res_req.ok}
                    <Alert class="mb-5" color="blue">
                        Uploaded {body.files.length} files
                    </Alert>
                {:else}
                    <Alert class="mb-5 font-bold text-left">
                        <span class="font-bold">[!]</span>
                        {body.message}
                    </Alert>
                {/if}
            {:catch _}
                <Alert color="red" class="mb-5 font-bold text-left">
                    <span class="font-bold">[!]</span> Request Failure
                </Alert>
            {/await}
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
