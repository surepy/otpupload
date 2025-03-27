# OTP-Upload
(because logging in for a single file sucks)

## Deploying

set ``OTP_SECRET=""`` and ``TOTP_WINDOW=10`` in ``docker-compose.yml`` or ``.env``

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

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
