<script lang="ts">
    import {
        Label,
        Fileupload,
        Button,
        Dropzone,
        Progressbar,
    } from "flowbite-svelte";
    import { Input } from "flowbite-svelte";
    import { Alert } from "flowbite-svelte";

    let files: FileList;
    let password: string;
    let request: Promise<Request> | any;

    $: request = null;

    function upload() {
        if (files.length < 1) {
            console.log("no files supplied");
            return;
        }

        let data = new FormData();

        for (let file of files) {
            data.append("files", file, file.name);
        }

        request = fetch("upload", {
            method: "post",
            body: data,
            headers: { otp: password },
        });
    }
</script>

<h1 class="dark:text-gray-200 text-3xl mb-1 font-medium">OTP-Upload</h1>

<p class="dark:text-gray-200 mb-5 text-sm font-light">
    <i>(because logging in for a single file sucks)</i>
</p>

<div class="w-full max-w-lg mb-5">
    {#if request}
        {#await request}
            <!-- TODO: move to axios so i can track progress -->
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

    <Fileupload bind:files class="mb-5" id="file" multiple clearable />

    <!-- TODO: dropzone -->
</div>

<Button class="mb-3 min-w-30 max-w-1/2 w-1/2" on:click={upload}>Upload</Button>