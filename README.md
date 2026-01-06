# OTP-Upload
(because logging in for a single file sucks)

## Why

I wanted to upload files to my truenas box without having to log into something when in a public pc for example

## Deploying

set ``OTP_SECRET=""`` and ``TOTP_WINDOW=10`` in ``docker-compose.yml`` or ``.env`` 

(get those values by running the app without them and going to ``/setup`` in the application, TODO this will be improved)

and ``AUTHKEY_ID``, ``AUTHKEY_PUBKEY``, ``AUTHKEY_ALGO`` by getting values in ``/setup_passkeys``

and deploy it how u like (I will use docker in truenas fyi)

keep ``UPLOAD_DIRECTORY="./uploads"`` as-is probably if using docker and just change the mounts

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
