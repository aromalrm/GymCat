# GymCat

Mobile workout app (Expo, TypeScript, Expo Router, Supabase). Milestone 1 is project setup, email auth, and the database schema. Onboarding, the calendar, logging, and the video player are later milestones.

Units are metric only. The app is free. Exercise videos are stored as URLs.

## Run

```bash
npm install
cp .env.example .env
npx expo start
```

Fill `.env` with your Supabase project URL and anon key, then restart Expo. Email sign-up and log-in use that project.

If those variables are empty, the auth screens still open and keep a session on the device only. That path is labeled in the UI and is not a Supabase account.

After sign-in, onboarding asks for height (cm), weight (kg), age, gender, and goal (cut, maintain, or bulk). The calorie target uses Mifflin–St Jeor with a sedentary factor of 1.2, then −500 kcal for cut, no change for maintain, or +300 kcal for bulk. Edit the number before saving. A finished profile is skipped on later launches. It is written to `public.users` when Supabase is configured, and to on-device storage otherwise.

A finished profile opens the monthly calendar. Days with `workout_logs` for the signed-in user show a dot. Tap a date to see that day's logged exercises (empty until logging exists) and six body-part cards. A card opens about five exercises, then a detail screen with instructions and the demo. Seeded video URLs are the X post, not a video file, so the detail screen says so and opens the post in the browser. An `mp4` (or similar) URL plays with expo-video. Without Supabase, the same seeded catalog is bundled in the app. Set logging is not built yet.

## Database

Apply `supabase/migrations/20261126120000_initial_schema.sql` in the Supabase SQL editor (or `supabase db push` once the CLI is linked). It creates `users`, `body_parts`, `exercises`, `workout_logs`, and `meal_logs`, enables row level security, and seeds six body parts with five exercises each.

Every seeded `video_url` is this post, so it is easy to replace per exercise later:

https://x.com/ErnestoSOFTWARE/status/2119926871882174818

A direct media file URL was not available when the seed was written. The same URL lives in `src/constants/demo-video.ts`.
