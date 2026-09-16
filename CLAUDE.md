# Throughline

A dating journal app: log people you're dating and post-date reflections, and surface patterns over time about who you connect with and what works.

## Repo

- GitHub: `tobywashere/throughline` — owned by Toby, Conner (this account, `connectconnor-cj`) is a collaborator with push access.
- This folder (`~/throughline`) is the one canonical local clone — don't create another.
- Workflow: feature branch + PR, never commit directly to `main`. Small, reviewable PRs.
- Git commit messages end with `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`; PR descriptions end with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

## Stack

- Expo (SDK 57) + React Native, TypeScript, `expo-router` for navigation, `zustand` for state, local storage via `expo-sqlite`.
- Fonts: Fraunces (serif, headings) + Inter (sans, body) via `@expo-google-fonts`.

## Design system

`src/theme.ts` is the source of truth for color/type/spacing in code; `throughline-brand-kit.html` is the authoritative design reference it should stay aligned with. Only two accent colors carry meaning — **rose** (pre-date / "before" moments) and **sage** (dating / growth-pattern moments) — never used as a red/green good-bad signal. Everything else stays neutral (ink, paper, muted).

`throughline-wireframes.html` and `throughline-one-pager.html` are additional design references (screen layouts and product pitch, respectively) — open them directly in a browser to see mockups.

## App structure

- `app/(tabs)/` — the four tabs: `index` (Home/pipeline), `people`, `dates`, `settings`.
- `app/new-*.tsx`, `app/person/[id].tsx`, `app/date/[id].tsx` — modal/detail screens.
- `src/store/useStore.ts` — zustand store; `src/db/` — SQLite access (`people.ts`, `entries.ts`, `notes.ts`, `client.ts`).
- `src/components/` — shared UI; `src/utils/` — date/ordinal/id helpers.

## Known limitations

- **Web is not wired up**: `expo-sqlite`'s web worker (wa-sqlite WASM) fails to bundle for `expo start --web`. This app is iOS/Android only for now.
- No local iOS simulator is set up on this machine (Xcode installed but not selected via `xcode-select`, no runtimes). Preview builds go through EAS instead.

## iOS builds (EAS)

- `eas.json` profiles: `development`, `preview` (internal/ad-hoc distribution, requires registered devices), `production` (store distribution — needed for TestFlight).
- `app.json` → `expo.extra.eas.projectId` links to the shared `throughline` EAS org project; `expo.owner: "throughline"`.
- iOS bundle identifier: `com.throughlinedating.app` (changed from the original `com.throughline.app`; Android `package` is still `com.throughline.app` — flag if these should be reconciled).
- Building requires: an active paid Apple Developer Program membership, the latest Program License Agreement accepted at developer.apple.com / App Store Connect, and Account Holder/Admin role — otherwise EAS's automatic credential (App Identifier / provisioning profile) creation fails partway with unclear errors like "Failed to find Bundle ID item".
- Run builds with `npx eas-cli build --platform ios --profile <profile>`, answering **yes** to the Apple account login prompt so EAS can manage credentials.
- TestFlight needs the `production` profile plus an App Store Connect app record for `com.throughlinedating.app`, then `npx eas-cli submit --platform ios --latest`.
