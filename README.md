# ICE SPOT POS 🍦

Production-ready Point of Sale (POS) web application for a small ice-cream shop.

## Tech Stack
- **Frontend:** Next.js App Router + Tailwind CSS + Zustand
- **Backend:** Node.js + Express + Prisma
- **Database:** SQLite (switchable to PostgreSQL)
- **Auth:** JWT email/password login
- **Printing:** Browser print receipt
- **Deploy:** Vercel (frontend), Render/Railway (backend)

## Project Structure

```text
billing/
  frontend/                # Next.js POS client
  backend/                 # Express API + Prisma
```

## Database Model
Implemented models in `backend/prisma/schema.prisma`:
- Users
- Items
- Sales
- SaleItems

Enums:
- `Role` = ADMIN / STAFF
- `Category` = CONE / CUP / SUNDAE
- `PaymentMode` = CASH / UPI

## Local Setup

### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

Runs on `http://localhost:5000`.

Default users:
- `admin@icespot.com / password123`
- `staff@icespot.com / password123`

### 2) Frontend
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Frontend Environment
Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## POS Features Delivered
- Category tabs (Cones/Cups/Sundaes)
- Big tap-friendly item grid
- Live cart with qty increment/decrement/remove
- Checkout popup with payment mode
- Sale persistence + inventory auto-reduction
- Receipt page with print + WhatsApp sharing link
- Role-based protected admin routes
- Admin inventory with low-stock badges
- Dashboard with daily metrics and top-selling items
- Staff management page

## Upgrade SQLite → PostgreSQL
In `backend/.env`:

```env
DATABASE_PROVIDER=postgresql
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/icespot?schema=public"
```

Then run:
```bash
cd backend
npx prisma migrate deploy
```

## Deployment

### Frontend (Vercel)
1. Import `frontend` directory in Vercel.
2. Set environment:
   - `NEXT_PUBLIC_API_URL=https://<backend-domain>/api`
3. Deploy.

### Backend (Render / Railway)
1. Create web service with root `backend`.
2. Build command: `npm install && npx prisma generate`
3. Start command: `npm run start`
4. Set env vars from `.env.example`.
5. For PostgreSQL in production, set `DATABASE_PROVIDER=postgresql` and `DATABASE_URL` accordingly.

## Production Notes
- Change `JWT_SECRET`
- Use HTTPS domains in CORS
- Add backups and logs
- Rotate staff passwords periodically
