# GymCat

Web UI matches the GymCat Figma frames: Today, Workout, and Progress. Expo web exports a static site (`web.output` is `static`) and `vercel.json` rewrites client routes to `index.html`.

## Routes

- `/` today
- `/workout` workout session
- `/progress` training record

## Run

```bash
npm install
npx expo start
```

Web export:

```bash
npx expo export --platform web
```
