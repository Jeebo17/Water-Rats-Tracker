# Mobile wrapper (Capacitor) — what I added and next steps

Summary
- Scaffolded a Capacitor wrapper under `mobile/` and added a small web-side push bridge in `src/util/capacitorPush.ts`.
- The mobile folder contains `package.json` and `capacitor.config.ts` configured to use your web build output at `dist/`.

Files added
- `mobile/package.json` — helper scripts and Capacitor dev dependencies.
- `mobile/capacitor.config.ts` — Capacitor config (appId, webDir, server.url placeholder).
- `src/util/capacitorPush.ts` — simple initializer exposing push events to the web app via `window` events.

Progress performed on this machine
- Installed Capacitor dependencies in `mobile/` and successfully added the Android platform. This created an `android/` native project inside `mobile/android` and copied web assets into `android/app/src/main/assets/public`.
- Commands executed here (successful):

```powershell
cd mobile
npm install
npx @capacitor/cli add android   # added @capacitor/android matching Capacitor v5
npx @capacitor/cli copy
```

If you ran `npx cap init` earlier and saw an error about `capacitor.config.ts`, that was because a TypeScript config file already existed — I kept the TS config and added Android by installing `@capacitor/android` compatible with the existing Capacitor version.

What I did NOT do (requires machine-specific tools / credentials)
- I did NOT run `npx cap init` / `npx cap add android` / `npx cap add ios` because adding native platforms requires Android SDK / Xcode on your machine.
- I did NOT configure Firebase / FCM credentials (`google-services.json`) or APNs keys — these require your Firebase project and Apple developer account.

How to finish (recommended step-by-step)
1. From repo root, build your web app:

```bash
npm install
npm run build
```

2. Initialize Capacitor (one-time) and create native projects (run in the `mobile/` folder):

```bash
cd mobile
npm install
npx cap init "Water Rats" com.example.waterrats --web-dir=../dist
npx cap add android
npx cap add ios   # macOS only
```

3. Copy web assets into native projects and open in IDEs:

```bash
npx cap copy
npx cap open android  # opens Android Studio
npx cap open ios      # opens Xcode (macOS)
```

4. Configure push notifications
- Android (FCM): create a Firebase project, register app, download `google-services.json` and place it into `android/app/` in the native project. Follow Firebase + Capacitor docs for wiring Gradle files and adding the FCM libs.
- iOS (APNs/FCM): enable Push Notifications and Background Modes in Xcode, upload APNs key to Firebase if using FCM, add entitlements, and configure capabilities.

5. Install Capacitor Push plugin in native projects

From `mobile/`:

```bash
npm install @capacitor/push-notifications
npx cap sync
```

6. In your web app, wire the initializer (example):

```ts
// src/main.tsx (or entry file)
import { initCapacitorPush } from './util/capacitorPush';

// call on startup (guarded inside the module)
initCapacitorPush();

// listen for incoming push events
window.addEventListener('capacitor-push', (e: any) => {
  console.log('Received push in web UI', e.detail);
});
```

7. Test on real devices (emulators may not deliver push tokens reliably). Use Android device with USB debugging and run from Android Studio.

Notes & tips
- For live dev, you can set `server.url` in `mobile/capacitor.config.ts` to your dev server URL (e.g. `http://192.168.1.10:5173`) so the native app loads your dev build directly — useful for fast iteration. Use a LAN IP reachable by device.
- Keep the mobile project in this repo or move to a sibling repo — both are fine. I kept it as `mobile/` to avoid changing your web project setup.

If you want, I can now:
- Try running `npx cap init` and `npx cap add android` on this machine (may fail if Android tooling is missing), or
- Continue and add example Firebase wiring and a minimal README for Play Store / App Store steps.
