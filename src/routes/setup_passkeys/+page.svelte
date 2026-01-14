<script lang="ts">
    import type { PageProps } from "./$types";
    import { client } from "@passwordless-id/webauthn";
    import { Button } from "flowbite-svelte";
    import { getAlgoName } from "@passwordless-id/webauthn/dist/esm/parsers";
    import type { RegistrationJSON } from "@passwordless-id/webauthn/dist/esm/types";

    let { data: pageData, form }: PageProps = $props();

    let formRef: HTMLFormElement;
    let registrationData : RegistrationJSON|null = $state(null);

    async function generateAndSave() {
        const registration = await client.register({
            user: "OTPUpload",
            challenge: pageData.challenge,
        });

        registrationData = registration;

        // Submit form after state updates
        await new Promise(r => setTimeout(r, 0));
        formRef.submit();
    }
</script>

<h1 class="dark:text-gray-200 text-3xl mb-10 font-medium">Passkey Setup</h1>

<p class="dark:text-gray-200 mb-5 text-lg font-medium">
    Click to register your passkey, then you'll be redirected to the app.
</p>

<!-- TODO -->
{#if form?.error}
	<p>form?.error}</p>
{/if}

<form method="POST" bind:this={formRef}>
    <input type="hidden" name="registration" value={registrationData} />
    <Button class="min-w-30 max-w-50 w-full mt-6" onclick={generateAndSave}>Register Passkey</Button>
</form>
