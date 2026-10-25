# DigitalMarketingCampaignService-frontend

A React, Vite, and plain CSS frontend for the existing Digital Marketing Campaign Service.

## Run locally

1. Start the Spring Boot backend. Its current configuration listens on `http://localhost:8081`.
2. In this folder, install dependencies and start Vite:

   ```bash
   npm install
   npm run dev
   ```

3. Open the local URL printed by Vite (typically `http://localhost:5173`).

The Vite development and preview servers proxy `/DigitalMarketingCampaign` requests to the backend, so the backend does not need CORS changes.

## Change the backend address

Copy `.env.example` to `.env` in this folder and set `VITE_BACKEND_URL`, for example:

```env
VITE_BACKEND_URL=http://localhost:8081
```

Restart Vite after changing this value. For a production deployment, configure the hosting server/reverse proxy to forward `/DigitalMarketingCampaign` to the same backend address.

## Production build

```bash
npm run build
npm run preview
```
