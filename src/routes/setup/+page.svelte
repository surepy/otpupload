<script lang="ts">
    import { goto } from "$app/navigation";
    import { Blockquote, Label } from "flowbite-svelte";
    import * as OTPAuth from "otpauth";

    const new_otp_secret = new OTPAuth.Secret();

	const totp = new OTPAuth.TOTP({
		// Provider or service the account is associated with.
		issuer: "otp-upload",
		// Algorithm used for the HMAC function, possible values are:
		//   "SHA1", "SHA224", "SHA256", "SHA384", "SHA512",
		//   "SHA3-224", "SHA3-256", "SHA3-384" and "SHA3-512".
		algorithm: "SHA1",
		// Length of the generated tokens.
		digits: 6,
		// Interval of time for which a token is valid, in seconds.
		period: 30,
		// Arbitrary key encoded in base32 or `OTPAuth.Secret` instance
		// (if omitted, a cryptographically secure random secret is generated).
		secret: new_otp_secret,
		//   or: `OTPAuth.Secret.fromBase32("US3WHSG7X5KAPV27VANWKQHF3SH3HULL")`
		//   or: `new OTPAuth.Secret()`
	});
</script>

<h1 class="dark:text-gray-200 text-3xl mb-10 font-medium">OTP-Upload Setup</h1>


<p class="dark:text-gray-200 text-lg font-medium">
    paste into .env
</p>
<Blockquote border bg class="p-4 ">
    <p>OTP_SECRET="{new_otp_secret.base32}"</p>
</Blockquote>
<p class="dark:text-gray-200 mb-5 text-lg font-medium">
    and rebuild/restart the server.
</p>

<p class="dark:text-gray-200 mb-5 text-lg font-medium">
    your OTP url is
</p>

<Blockquote border bg size="sm" class="justify-center p-4 my-4">
    <p>{totp.toString()}</p>
</Blockquote>