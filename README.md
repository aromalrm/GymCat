# GymCat

Web UI uses the Stitch layout under the GymCat name. Screens are the exported HTML, including the static figure treatment. There is no auth flow and no real-time 3D engine.

## Routes

- `/` redirects to `/onboarding`
- `/onboarding` biometric calibration
- `/calendar` mesocycle calendar
- `/week` weekly split
- `/anatomy` muscle target map
- `/muscle-map` anatomy explorer
- `/library` exercise catalog
- `/guides` form guides
- `/execute` workout execution
- `/exercise` exercise detail
- `/nutrition` fuel matrix
- `/profile` biometric settings

## Run

```bash
npm install
npx expo start
```

Web export:

```bash
npx expo export --platform web
```
