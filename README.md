# GymCat

Mobile workout app (Expo, TypeScript, Expo Router, Supabase). Metric only. Free, with no payments. Exercise videos are stored as URLs.

## Walkthrough

1. Sign up or log in with email. Without Supabase env vars this stays on the device and the screen says so.
2. Onboarding: height in cm, weight in kg, age, gender, and goal (cut, maintain, or bulk). Confirm or edit the calorie target, then save. Later launches skip this when a profile exists.
3. The home screen is a month calendar. Days with workouts show a dot.
4. Tap a date, then a body part (chest, back, shoulders, arms, legs, core).
5. Open an exercise. Instructions are on the detail screen. The seeded demo is an X post, so the app says it is not a video file and opens it in the browser. An mp4 URL would play in the app.
6. On that same screen, log sets, reps, and weight in kg for the date you opened. Go back to the day to see the entry.
7. From home, open Nutrition and save calories for a day. Protein, carbs, and fat are optional.
8. From home, open Profile to edit the same stats and calorie target as onboarding.

## Run

```bash
npm install
cp .env.example .env
npx expo start
```

Fill `.env` with your Supabase project URL and anon key, then restart Expo. Email sign-up and log-in use that project.

If those variables are empty, the auth screens still open and keep a session on the device only. That path is labeled in the UI and is not a Supabase account.

After sign-in, onboarding asks for height (cm), weight (kg), age, gender, and goal (cut, maintain, or bulk). The calorie target uses Mifflin–St Jeor with a sedentary factor of 1.2, then −500 kcal for cut, no change for maintain, or +300 kcal for bulk. Edit the number before saving. A finished profile is skipped on later launches. It is written to `public.users` when Supabase is configured, and to on-device storage otherwise.

Profile edits use the same checks and save path as onboarding. Workouts and meals go to Supabase when env is set, and stay on the device otherwise. Without Supabase, the seeded exercise catalog is bundled in the app.

## Database

Apply `supabase/migrations/20261126120000_initial_schema.sql` in the Supabase SQL editor (or `supabase db push` once the CLI is linked). It creates `users`, `body_parts`, `exercises`, `workout_logs`, and `meal_logs`, enables row level security, and seeds six body parts with five exercises each.

Every seeded `video_url` is this post, so it is easy to replace per exercise later:

https://x.com/ErnestoSOFTWARE/status/2119926871882174818

A direct media file URL was not available when the seed was written. The same URL lives in `src/constants/demo-video.ts`.
