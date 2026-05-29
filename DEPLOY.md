# DRISHTI — Production Deploy Guide (All on Render)

Three services, one platform:

| Service              | Render type   | URL pattern                              |
| -------------------- | ------------- | ---------------------------------------- |
| Frontend (React)     | Static Site   | `https://drishti-frontend.onrender.com`  |
| Backend (Spring Boot)| Web (Docker)  | `https://drishti-backend.onrender.com`   |
| AI assistant (Python)| Web (Python)  | `https://drishti-ai.onrender.com`        |
| Database             | NeonDB        | (already cloud)                          |

All free tier. Web services sleep after 15 min idle (~30s cold start). Static sites don't sleep.

---

## 1 — Push the latest code

```bash
cd c:\Users\ajsal\Downloads\DRISHTI-demo_branch\DRISHTI-demo_branch
git status
git add -A
git commit -m "Switch deploy plan to all-Render"
git push origin demo_branch
```

---

## 2 — Apply the Render Blueprint

If you already applied the Blueprint earlier (with only backend + AI), Render will detect the new third service when you push:

1. Go to <https://dashboard.render.com/blueprints>
2. Open your existing `Drishti` blueprint
3. Click **Sync** — Render reads the new `render.yaml` and proposes the `drishti-frontend` static site
4. Click **Apply**

First time? At <https://dashboard.render.com> click **New → Blueprint** → pick your repo → branch `demo_branch` → Apply.

Wait until all three services say **Live** (frontend builds in ~3 min, backend Docker takes ~5 min).

---

## 3 — Fill in the secrets

Open each service → **Environment** tab.

### drishti-backend

| Key                | Value                                                                            |
| ------------------ | -------------------------------------------------------------------------------- |
| `DB_URL`           | `jdbc:postgresql://ep-restless-snow-and6t87b-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channelBinding=require` |
| `DB_USERNAME`      | `neondb_owner`                                                                   |
| `DB_PASSWORD`      | `npg_vArTdNH06uYl`                                                               |
| `JWT_SECRET`       | (Render auto-generates — leave it)                                               |
| `APP_CORS_ORIGINS` | `https://drishti-frontend.onrender.com` *(use the actual Frontend URL)*          |
| `FRONTEND_URL`     | `https://drishti-frontend.onrender.com` *(same)*                                 |
| `GOOGLE_CLIENT_ID` | `118261105575-mtcij6sgpp5uuc65gldi6500nfsqve9o.apps.googleusercontent.com`       |
| `CHAT_API_URL`     | `https://drishti-ai.onrender.com/api/chat` *(use the actual AI URL)*             |
| `MAIL_USERNAME`    | *(blank)*                                                                        |
| `MAIL_PASSWORD`    | *(blank)*                                                                        |

### drishti-ai

| Key              | Value                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| `NVIDIA_API_KEY` | `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`                              |

### drishti-frontend (static site)

| Key                          | Value                                          |
| ---------------------------- | ---------------------------------------------- |
| `REACT_APP_API_URL`          | `https://drishti-backend.onrender.com`         |
| `REACT_APP_AI_URL`           | `https://drishti-ai.onrender.com`              |
| `REACT_APP_GOOGLE_CLIENT_ID` | `118261105575-mtcij6sgpp5uuc65gldi6500nfsqve9o.apps.googleusercontent.com` |

⚠️ **Static-site env vars are baked at build time.** After setting them, click **Manual Deploy → Clear build cache & deploy** on the `drishti-frontend` service to trigger a rebuild with the new values.

---

## 4 — Update Google OAuth

1. <https://console.cloud.google.com> → APIs & Services → Credentials → your OAuth client.
2. **Authorized JavaScript origins** → Add → `https://drishti-frontend.onrender.com`
3. Save.

---

## 5 — One-time DB cleanup

If you previously used Supabase, drop the old `profiles` table once from the Neon SQL editor:

```sql
DROP TABLE IF EXISTS profiles CASCADE;
```

Hibernate will rebuild it with the current schema. The backend auto-seeds the dev admin (`drishtidev@gmail.com` / `drishti123`).

---

## 6 — Smoke test

1. Open `https://drishti-frontend.onrender.com`. The home page loads with the login form on the right.
2. **Cookie banner** appears at the bottom — pick a choice.
3. Try **Sign in with Google** → pick a Google account → land on `/course` (or get the phone verification modal first).
4. Visit `/admin-login`, sign in as `drishtidev@gmail.com` / `drishti123` → land on `/admin`.
5. Manage Courses → create a course with a YouTube URL → preview as student/institution.
6. Bottom-right ✨ → ask the AI assistant a question.

---

## Keeping the demo warm

Backend and AI services sleep after 15 min idle. Before a live demo:
- Open `https://drishti-backend.onrender.com/api/public/health`
- Open `https://drishti-ai.onrender.com/`
- Or just hit the frontend — it'll wake both services within ~30s.

For zero cold start during a demo, upgrade `drishti-backend` to Render's **$7/mo Starter** plan (always-on). Or set up a free cron job (UptimeRobot, cron-job.org) to ping `/api/public/health` every 14 minutes.

---

## Common pitfalls

- **CORS error in browser console** → `APP_CORS_ORIGINS` doesn't exactly match the frontend URL. Must include `https://` and no trailing slash.
- **Google button missing in prod** → `REACT_APP_GOOGLE_CLIENT_ID` wasn't set when the static site was built. Set it, then **clear build cache and redeploy** the frontend.
- **"Failed to fetch" on login** → backend is asleep. Wait ~30s. Or check Render logs for the real error.
- **Mixed-content blocked** → some env var still says `http://`. All should be `https://`.
- **DB auth failed** → Neon password is wrong/rotated. Reset in Neon, paste into Render env.
- **Static-site routes 404 on refresh** → the SPA rewrite rule in `render.yaml` should handle this; if it doesn't, check the Routes tab.
