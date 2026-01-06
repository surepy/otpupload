<script lang="ts">
    import { onMount } from "svelte";
    import type { PageProps } from "./$types";
    import { client } from "@passwordless-id/webauthn";
    import { Blockquote, Button } from "flowbite-svelte";
    import { getAlgoName } from "@passwordless-id/webauthn/dist/esm/parsers";

    let { data: pageData}: PageProps = $props();

    async function sketchy_generate_fn() {

        const registration = await client.register({
            user: "OTPUpload",
            challenge: pageData.challenge,
        });

        // BAD -- BAD -- BAD -- BAD -- BAD -- BAD -- BAD
	    // DO NOT EVER DO THIS IN A SERIOUS WEBAUTHN IMPLEMENTATION, I KNOW
        // HOWEVER YOU HAVE TO PLUG THIS VALUES INTO .ENV SO THIS SHOULD BE FINE
	    authkey_id = registration.id;
        authkey_publicKey = registration.response.publicKey;
        // this should probably turn into private api soon lol
        authkey_algorithm = getAlgoName(registration.response.publicKeyAlgorithm);
    }

    onMount(async () => { });

    let authkey_id = $state("<Waiting...>");
    let authkey_publicKey = $state("<Waiting...>");
    let authkey_algorithm = $state("<Waiting...>");
</script>



<p class="dark:text-gray-200 text-lg font-medium mb-2">
    paste into .env (or set into docker)
</p>
<Blockquote border bg class="p-4 ">
    <p>AUTHKEY_ID="{authkey_id}"</p>
    <p>AUTHKEY_PUBKEY="{authkey_publicKey}"</p>
    <p>AUTHKEY_ALGO="{authkey_algorithm}"</p>
</Blockquote>
<p class="dark:text-gray-200 mb-5 text-lg font-medium">
    and rebuild/restart the server.
</p>


<Button class="min-w-30 max-w-1/4 w-full mt-6" onclick={sketchy_generate_fn}>Generate Authkey</Button>
