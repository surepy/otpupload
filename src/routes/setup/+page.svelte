<script lang="ts">
    import { Blockquote, Button } from "flowbite-svelte";
    import * as OTPAuth from "otpauth";

    const new_otp_secret = new OTPAuth.Secret();

    const totp = new OTPAuth.TOTP({
        issuer: "otp-upload",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: new_otp_secret,
    });
</script>

<h1 class="dark:text-gray-200 text-3xl mb-10 font-medium">OTP-Upload Setup</h1>

<p class="dark:text-gray-200 mb-5 text-lg font-medium">
    Scan this with your authenticator app:
</p>

<Blockquote border bg size="sm" class="justify-center p-4 my-4">
    <p>{totp.toString()}</p>
</Blockquote>

<form method="POST" class="mt-6">
    <input type="hidden" name="otpSecret" value={new_otp_secret.base32} />
    <Button type="submit" class="min-w-30 max-w-1/4 w-full">Save & Continue</Button>
</form>
