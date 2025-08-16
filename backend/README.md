
# Matty Backend (MERN)

Backend for **Matty – Online Graphic Design Tool**.

## Tech
- Node.js, Express
- MongoDB (Mongoose)
- JWT Auth
- Cloudinary for images
- Helmet, CORS, Rate Limiting, Compression, Morgan

## Run Locally

```bash
cd matty-backend
npm install
cp .env.example .env  # fill values
npm run dev
```

Server runs at `http://localhost:5000`.

## API

### Auth
- `POST /api/auth/register` `{ username, email, password }`
- `POST /api/auth/login` `{ email, password }`

### Designs (protected: Bearer {{TOKEN}})
- `GET /api/designs` → list my designs
- `GET /api/designs/:id` → single design
- `POST /api/designs` (form-data)
  - `title`: string
  - `jsonData`: stringified JSON of canvas
  - `thumbnail`: file (image) optional
  - `tags`: comma separated (optional)
  - `isPublic`: "true"/"false" (optional)
- `PUT /api/designs/:id` (form-data or JSON)
- `DELETE /api/designs/:id`

## Notes
- Multer saves uploaded file to `/uploads` temporarily; file is deleted after upload to Cloudinary.
- Increase `express.json({ limit })` if you expect bigger JSON payloads.
- Set `CORS_ORIGIN` to your frontend origin in production.
