---
inclusion: manual
---

# References: quality-engineering

> 13 reference files with code examples and implementation patterns.
> Load this file when you need detailed examples beyond the core rules in `skills-quality-engineering.md`.

## quality-engineering-appium-mcp

### lambdatest-cloud-setup

# LambdaTest Real Device Cloud — Generic Setup

Reference for the `appium-mcp` skill. Project-agnostic.

## Endpoint

```text
remoteServerUrl: https://${LAMBDATEST_USERNAME}:${LAMBDATEST_ACCESSKEY}@mobile-hub.lambdatest.com/wd/hub
```

The userinfo segment carries credentials — do not log this URL; treat it like a bearer token.

## Capabilities template (Android skeleton)

```jsonc
{
  "platformName": "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "<from project-context.md>",
  "appium:platformVersion": "<from project-context.md>",
  "appium:app": "lt://APP<your-uploaded-app-id>",
  "appium:appPackage": "<your.app.package>",
  "appium:appActivity": "<your.app.MainActivity>",
  "appium:autoGrantPermissions": true,
  "appium:noReset": false,
  "appium:newCommandTimeout": 600,
  "lt:options": {
    "build": "<grouping label, e.g. ticket id>",
    "name": "<per-session label>",
    "isRealMobile": true,
    "visual": true,
    "video": true,
    "console": true,
    "deviceLog": true,
    "network": false,
    "idleTimeout": 600,
    "queueTimeout": 600,
  },
}
```

iOS: change `platformName` to `iOS`, `automationName` to `XCUITest`, replace `appPackage`/`appActivity` with `appium:bundleId`.

## App upload (one-time per build)

```bash
curl -u "$LAMBDATEST_USERNAME:$LAMBDATEST_ACCESSKEY" \
  -X POST https://manual-api.lambdatest.com/app/upload/realDevice \
  -F "appFile=@./your-app.aab" \
  -F "name=your-app-<short-tag>" \
  -F "custom_id=your-app-<release-id>"
```

Returns JSON with `app_url: "lt://APP..."`. Pass that as `appium:app`.

## .aab → device .apk conversion (Android-only gotcha)

LambdaTest converts `.aab` to device-specific APKs and **re-signs with their internal cert**.
- **SHA-pinned services** (Firebase Auth, App Check, Maps API) may reject the LambdaTest-signed APK.
- **Mitigation**: register LambdaTest's debug SHA in your allowed-signature list.

## Session lifecycle

1. **Create**: `appium_session_management action=create`.
2. **Identify session id**: Store for video/log pull.
3. **Use**: tools per `tool-cheatsheet.md`.
4. **Delete**: `appium_session_management action=delete`. **MANDATORY**.

## Cost notes

- Meting starts when first command lands.
- typical session: 3–8 min.
- LambdaTest auto-records video — pull via REST `GET /automation/api/v1/sessions/<sessionId>`.


---

### project-context

# Mobile — appium-mcp Context

Project-specific reference for the Mobile Flutter app on LambdaTest.

## Project Facts

| Property                | Value                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| App package (Android)   | `com.androidapp.uat`                                                                              |
| App activity (Android)  | `com.androidapp.MainActivity`                                                                     |
| UI framework            | Flutter (renders to one `FlutterSurfaceView`)                                                                 |

## Default device — Galaxy S26+ / Android 16

Lock to one device per run. **Galaxy ships One UI**, not stock Android — system dialogs differ in position and text (e.g. "Allow" vs "While using the app").

## App-id resolution

```bash
./scripts/lambdatest-app-upload.sh --source pipeline
# → emits lt://APP... on stdout
```

## Common overlays after launch (cold-start)

| #   | Overlay                               | How to dismiss                                          |
| --- | ------------------------------------- | ------------------------------------------------------- |
| 1   | Notification permission dialog        | `find_element(uiautomator, text("Allow"))` → tap.       |
| 2   | Onboarding splash carousel            | Tap CTA centered near bottom of screen (~y=2180).       |
| 3   | Promo banner modal                    | Top-right `×` close button.                             |
| 4   | eZpoint reminder modal                | Modal CTA y ≈ 2050 on 1080×2340.                        |

### Gesture-inset gotcha (Samsung One UI)

Samsung's gesture-nav reserves the bottom **~150px**. Simple `tap` events at `y > 2200` are intercepted by the OS.
- **Bottom-nav tabs**: target `y ≤ 2150`.
- **Modal CTA buttons**: target `y ≈ 2050`, not `y ≥ 2100`.

## Fast login macro (Indonesia market)

1. tap(x=540, y=800)              # username field
2. set_value(text=<username>, w3cActions=true)
3. tap(x=540, y=1080)             # password field
4. set_value(text=<password>, w3cActions=true)
5. keyboard(action=hide)
6. tap(x=540, y=1370)             # Masuk button

## App language ≠ market

**Country selection at login sets the _market_ (backend region) — it does NOT set the UI language.** UI language is an account preference.

To switch app language:
1. Open bottom-nav `More` tab.
2. Tap `Profile`.
3. Find `Language` dropdown and select target.

## Screenshot discipline

Screenshots are expensive. Use lower-resolution for navigation checks; full-res only for the final verdict.

| Purpose                  | Resolution      | When to use                                   |
| ------------------------ | --------------- | --------------------------------------------- |
| Navigation check         | `maxWidth=300`  | After taps to confirm screen identity.        |
| Find element / read text | `maxWidth=540`  | When agent needs to read text or count items. |
| Verdict evidence         | full resolution | One per AC pass / fail.                       |


---

### tool-cheatsheet

# appium-mcp Tool Cheatsheet

Copy-paste argument shapes for the most-used `mcp__appium-mcp__*` tools.

## Session lifecycle

### Create remote session (LambdaTest)

```jsonc
// mcp__appium-mcp__appium_session_management
{
  "action": "create",
  "remoteServerUrl": "https://${LAMBDATEST_USERNAME}:${LAMBDATEST_ACCESSKEY}@mobile-hub.lambdatest.com/wd/hub",
  "platform": "android",
  "capabilities": {
    /* see lambdatest-cloud-setup.md */
  },
}
```

### List / select / delete

```jsonc
{ "action": "list" }                              // all sessions + ownership
{ "action": "select", "sessionId": "<id>" }       // switch active
{ "action": "delete", "sessionId": "<id>" }       // teardown — always call
```

## Element interaction

### Find native dialog element

```jsonc
// mcp__appium-mcp__appium_find_element
{
  "strategy": "accessibility id",   // > "id" > "-android uiautomator" > "xpath"
  "selector": "Allow"
}
```

### Tap / swipe / scroll

```jsonc
// mcp__appium-mcp__appium_gesture
{ "action": "tap", "x": 740, "y": 1810 }
{ "action": "tap", "elementUUID": "<uuid>" }
{ "action": "long_press", "x": 540, "y": 1200, "duration": 800 }
{ "action": "swipe", "from": {"x": 900, "y": 1300}, "to": {"x": 180, "y": 1300} }
```

### Text input

```jsonc
// mcp__appium-mcp__appium_set_value
{ "elementUUID": "<uuid>", "text": "hello@example.com" }

// mcp__appium-mcp__appium_mobile_keyboard
{ "action": "hide" }                              // dismiss soft keyboard
```

### Read / alert

```jsonc
// mcp__appium-mcp__appium_alert
{ "action": "accept" }      // OK / Allow on system alerts
{ "action": "dismiss" }
```

## Screen capture

```jsonc
// mcp__appium-mcp__appium_screenshot
{}                                                // full screen
{ "elementUUID": "<uuid>" }                       // crop to one element
```

## App lifecycle

```jsonc
// mcp__appium-mcp__appium_app_lifecycle
{ "action": "activate",     "bundleId": "com.example.app" }
{ "action": "terminate",    "bundleId": "com.example.app" }
{ "action": "deep_link",    "url": "yourscheme://path/to/screen" }
{ "action": "background",   "duration": 5 }
```

## Device control

```jsonc
// mcp__appium-mcp__appium_mobile_device_control
{ "action": "open_notifications" }                // Android only

// mcp__appium-mcp__appium_geolocation
{ "action": "set", "latitude": 10.762, "longitude": 106.660 }   // Ho Chi Minh
```


---

## quality-engineering-business-analysis

### analysis_patterns

# Deep Analysis Patterns & Examples

## 1. Actor Permissions Mapping

_Goal: Identify behavior variance across user roles._

| Actor         | Access               | Constraints                                    |
| :------------ | :------------------- | :--------------------------------------------- |
| **Customer**  | View Order, Pay      | Cannot see "Sales Rep Notes"                   |
| **Sales Rep** | View All, Sync, Edit | Can see all Payment Terms regardless of toggle |
| **Admin**     | Full Access          | Can override toggles                           |

## 2. Logic Conflict Detection (Example)

_Scenario: Order History Payment Display_

- **Declared AC**: "Customers cannot see Payment Terms if `Toggle X` is OFF."
- **Existing System Rule**: "All users in VN Market must see Payment Terms for Legal Compliance."
- **Investigation Result**: 🛑 **P0 Conflict**. Technical toggle conflicts with Regulatory Compliance. Request clarification: "Does Toggle X override Legal requirements?"

## 3. Edge Case Matrix

| Category        | Specific Scenario                 | Expected Behavior (Implicit)                         |
| :-------------- | :-------------------------------- | :--------------------------------------------------- |
| **Network**     | Sync button clicked while offline | Show "No Internet" toast; queue action for retry     |
| **Empty State** | User has 0 orders                 | Display "No Orders Found" with CTA to Store          |
| **Boundary**    | Payment Term > 365 days           | Flag as "Invalid Data" or confirm UI can handle wrap |

## 4. State Investigation

_Example: Order Status vs visibility_

- **State: Pending**: Show Pay button.
- **State: Shipped**: Hide Pay button; show Tracking.
- **State: Cancelled**: Hide all Payment info; show "Refund Processed" if applicable.


---

### logic_truth_tables

# Logic Truth Tables (Requirement Simplification)

## Goal

Convert complex `AND/OR` requirements into a binary matrix to eliminate logic gaps before coding.

## Pattern: Boolean Permutation Matrix

When a feature is controlled by multiple independent variables (e.g., Toggles, Market, Role), create a truth table:

### Example: Payment Terms Visibility

Variables:

- **A**: `Enable Payment Terms` (Toggle)
- **B**: `Disable for Customer` (Toggle)
- **C**: `User Role` (Sales Rep = 1, Customer = 0)

| A (Enable) | B (DisableCus) | C (IsSalesRep) | **Result (Visible?)**       |
| :--------: | :------------: | :------------: | :-------------------------- |
|     1      |       0        |       0        | **YES** (Standard)          |
|     1      |       1        |       0        | **NO** (Override Disable)   |
|     0      |       X        |       0        | **NO** (Master Kill Switch) |
|     0      |       X        |       1        | **YES** (Sales Rep Bypass)  |
|     1      |       1        |       1        | **YES** (Sales Rep Bypass)  |

## Implementation Strategy

1. **Identify Variables**: Extract all "If", "When", and "Unless" conditions.
2. **Assign Values**: (1 = Enabled/True, 0 = Disabled/False, X = Don't Care).
3. **Map Results**: Fill row behavior based on Acceptance Criteria.
4. **Identify Gaps**: If a row is missing in the Jira AC, flag it as an **Undefined State**.

## Benefits

- Prevents "Side-Effect" bugs when one toggle accidentally overrides another.
- Direct input for unit test case generation.


---

### user_story_template

# User Story Authoring Template

## Story Header

**As a** `[Actor — be specific: {APP_NAME} Customer / VN Sales Rep / Admin]`,
**I want** `[Goal — one clear action]`,
**so that** `[Business Value — why it matters]`.

---

## In Scope

> List the pages, flows, or platforms explicitly covered by this story.

- `[BOTH]` Homepage — product card price display
- `[MOBILE]` Boosted products section
- `[WEB]` Product catalog and sub-pages

## Out of Scope

> List anything explicitly excluded to prevent scope creep.

- Product Detail Page with Tender Contract (separate story)
- Combo Detail Page

## Deferred

> Items not covered now but tracked. Each item MUST link to a Jira ticket.

- Translation / locale behavior → [TICK-42955](https://your-jira-url/browse/TICK-42955)

---

## Acceptance Criteria

> One `Given / When / Then` block per AC. One condition per block. Tag every AC with platform and toggle state.

### AC 1 — [Short Label]

```
Toggle: DisplayItemTaxBreakdown = ON
Platform: [BOTH]
Actor: Customer

Given  the user is an Customer with DisplayItemTaxBreakdown = ON
When   the user views a product card on the Homepage
Then   the product card shows:
         - Price After Tax (highlighted, strikethrough if list price > offer price)
         - Price Before Tax
         - Tax amount
       AND the font size/weight follows the agreed design spec
```

### AC 2 — [Short Label]

```
Toggle: DisplayItemTaxBreakdown = OFF
Platform: [BOTH]
Actor: Customer

Given  the user is an Customer with DisplayItemTaxBreakdown = OFF
When   the user views a product card on any page
Then   the product card shows the price highlighted (style update only)
       AND the product UI structure is unchanged
```

### AC 3 — [Market: VN] Tender Contract Tag

```
Toggle: N/A
Platform: [BOTH]
Market: VN
Actor: VN Customer

Given  the user is a VN Customer
  AND  a Tender Contract product is available in the product catalog
When   the user views the product card
Then   the product card shows a "Tender available" tag with icon
  AND  if the product has a mandatory tender contract, the CTA reads "Buy with tender"
```

---

## Actor / Platform Matrix

| AC   | Actor        | Platform | Toggle                      | Market |
| ---- | ------------ | -------- | --------------------------- | ------ |
| AC 1 | Customer     | BOTH     | DisplayItemTaxBreakdown=ON  | All    |
| AC 2 | Customer     | BOTH     | DisplayItemTaxBreakdown=OFF | All    |
| AC 3 | VN Customer  | BOTH     | N/A                         | VN     |

---

## Open Questions / Blockers

> Flag unresolved gaps here. Do NOT write "to discuss" inline in AC — move it here with an owner.

| #   | Question                                   | Owner   | Jira                                                                |
| --- | ------------------------------------------ | ------- | ------------------------------------------------------------------- |
| 1   | Does translation AC need a separate story? | BA Lead | [TICK-42955](https://your-jira-url/browse/TICK-42955) |


---

## quality-engineering-playwright-cli

### anti-patterns-rationale

# playwright-cli Anti-patterns — Rationale

The SKILL.md anti-pattern list is one-line for scannability. This file holds the WHY behind each rule so the rules survive future edits.

## No bare `playwright-cli` (always pass `-s=<session>`)

The bare form (`playwright-cli click ...`) uses an implicit default browser. If two flows run at once — e.g. a dev's `/verify-implementation` overlapping a `/verify-bug` for a different ticket — they share the same default browser and stomp each other's state. Named sessions (`-s=verify-impl-TICK-45140`, `-s=verify-bug-TICK-45140-TH`) make collisions impossible and self-document which browser each line targets. The shared permission allowlist only covers `Bash(playwright-cli -s=* ...)` patterns; bare invocations trigger a permission prompt every time.

## No `wait-for` subcommand

The CLI does not implement a `wait-for` subcommand. Calling it returns "unknown command". Use the snapshot-grep poll documented in SKILL.md "Waiting for content".

## No `npx @playwright/cli`

`npx @playwright/cli@latest …` adds 1-3 s of latency per call (npm registry round-trip + cache check) and silently upgrades the version between runs. Pin via `npm i -g @playwright/cli@0.1.8` and call the installed `playwright-cli` binary directly.

## No paths outside cwd

The CLI denies file writes to `/tmp`, `$TMPDIR`, `~/Downloads`, and any absolute path outside the current working directory. Use `.playwright-cli/` (gitignored) for all artefacts.

## No screenshot for assertions

Screenshots are images — you can't grep them. Use `snapshot` (accessibility tree text) for element-presence checks; reserve `screenshot` for human-visible evidence attached to JIRA.

## No `--full-page` screenshots

`--full-page` images are 5-6× larger than viewport shots and add no extra evidence value when the proof element fits a single viewport. Use `playwright-cli hover <ref>` to scroll the proof into view, then take a normal viewport shot.

## No screenshot without prior `hover`

A viewport screenshot taken without first scrolling the proof element into view may show only the page header — the verified element sits below the fold. Always `hover <ref>` immediately before `screenshot`.

## No reusing a ref across snapshots

Element refs (`e123`, `e456`, …) are session-specific and may change between snapshots when the DOM re-renders. Always re-snapshot to get fresh refs before clicking, hovering, or filling. A stale ref produces a "ref not found" error halfway through a flow.

## No skipping `state-save` after login

The login dance (multi-account fallback, MFA, redirect) is expensive — 30-90 s. After a successful login, `state-save .playwright-cli/<scope>-auth.json` so subsequent runs `state-load` and skip directly to the authenticated app.

## No open without close

Orphaned sessions hold a Chromium process and a port — over time they leak state and exhaust the agent's session table. Always `playwright-cli close` at the end of every run, including failure paths.

## No skip console check

Console errors (hydration failures, chunk-load errors, uncaught promise rejections) often surface bugs that are invisible in the rendered UI. Run `playwright-cli console` after every navigation and include the count in `VERIFY_RESULT`.

## No committed auth state

`state-save` JSON contains live session cookies. Committing it would let any reader of the repo impersonate the test account. `.playwright-cli/` is in `.gitignore` for this reason — do not bypass with `git add -f`.

## No credentials on disk

Never write a password to a file (e.g. `echo "$PASSWORD" > .playwright-cli/pwd`). Pass credentials via shell env vars within a single Bash compound command, or re-grep from the env file each time. The only `.playwright-cli/*.json` allowed is `state-save` output, which is already gitignored.

## No variable PID

`$DEV_PID=$!` does not persist across separate Bash tool calls — each call gets a fresh shell. Save the dev server PID to `.playwright-cli/dev.pid` (a file) immediately after starting the server, then `kill $(cat .playwright-cli/dev.pid)` at teardown.

## No leftover dev/log files between runs

A stale `.playwright-cli/dev.pid` from a previous run causes the next run's liveness check (`kill -0 $(cat dev.pid)`) to either falsely report "dev server died" or kill an unrelated process that recycled the same PID. Always `rm -f .playwright-cli/dev.pid .playwright-cli/dev.log` at end of run.


---

### project-context

# Frontend — playwright-cli Context

Project-specific reference for the Next.js frontend (`datasource/frontend/`). Load this alongside `playwright-cli/SKILL.md` when in that repo or its worktrees, to skip discovery and avoid the env-loader / market / VPN / cred traps.

## Project Facts

| Property              | Value                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------ |
| Repo                  | `datasource/frontend/`                                                                |
| Stack                 | Next.js 14 (Pages Router) + React 18 + TypeScript 5.5 + Apollo + MUI + TailwindCSS         |
| Dev server script     | `cross-env NODE_ENV=development env-cmd -f .env node server` ← **uses env-cmd**            |
| Custom server         | `server.js` (express + http-proxy-middleware) — proxies `/api/*` to GraphQL backends       |
| Markets               | 13: HK / ID / KH / KR / MM / MY / PH / SG / TH / TW / VNP / VNS / VNM                      |
| Markets source-of-truth | `.vscode/launch.json` — 40+ debug configs, one per market × env                          |
| Test creds            | `integration_test/src/env/uat-{market}.env` (extracted from `integration_test/src/env.zip`)|
| Local URL             | `http://localhost:3000` (dev), `https://uat-{market}.yourdomain.com` (UAT — DO NOT verify pre-commit) |
| Backend hosts         | `*-uat-{market}.yourdomain.com` (corporate internal — VPN required)                              |

## Env-Loader Critical Gotcha

`package.json` `dev` script is `env-cmd -f .env node server`. **`env-cmd` OVERWRITES shell exports AND ignores `.env.local`.** The only way to switch market env is to **edit `.env` directly** (gitignored — safe).

### Market-switch recipe (mandatory pre-build)

```bash
# 1. Backup current .env
cp .env .playwright-cli/env-backup-original

# 2. Extract target-market env block from launch.json (JSONC — strip comments first)
TARGET="UAT-{MARKET} - debug in localhost"
sed -E 's|[[:space:]]*//[^"]*$||' .vscode/launch.json | jq -r --arg name "$TARGET" \
  '.configurations[] | select(.name==$name) | .env | to_entries | map("\(.key)=\(.value)") | .[]' \
  > /tmp/overlay.env

# 3. Merge: keep non-overridden keys from original, append overlay (later wins)
OVERRIDE=$(cut -d= -f1 /tmp/overlay.env | sort -u | tr '\n' '|' | sed 's/|$//')
grep -v -E "^($OVERRIDE)=" .playwright-cli/env-backup-original > .env.new
cat /tmp/overlay.env >> .env.new
mv .env.new .env

# 4. Sanity check
grep "^COUNTRY_CODE=" .env  # must show {MARKET}
```

### Cleanup (CRITICAL — restore on exit)

```bash
[ -f .playwright-cli/env-backup-original ] && mv .playwright-cli/env-backup-original .env
```

Skipping the restore leaks the verify-run market into the developer's next `npm run dev`.

### Verify proxies actually point at target market

```bash
grep "Proxy created" .playwright-cli/dev.log | head -3
# Must show *-uat-{market}.yourdomain.com URLs. Wrong market = overlay didn't apply.
```

## VPN Pre-flight (mandatory)

Backend hosts are on internal DNS — without VPN, `*.yourdomain.com` returns NXDOMAIN and login renders a misleading "Login Failed" UI.

```bash
HOST=$(grep '^ORDER_API=' .env | head -1 | cut -d= -f2 | sed 's|https*://||;s|/.*||')
host "$HOST" 2>&1 | grep -q "has address" \
  || { echo "FAIL: $HOST is NXDOMAIN — connect Company VPN before retrying"; exit 1; }
```

## env.zip Auto-Extract

Test credentials live in `integration_test/src/env.zip` (gitignored after extraction). If unextracted, `uat-{market}.env` files are missing.

```bash
[ ! -d integration_test/src/env ] && [ -f integration_test/src/env.zip ] \
  && (cd integration_test/src && unzip -o env.zip > /dev/null)
```

## Husky Bootstrap (fresh worktree)

```bash
[ -f .husky/pre-commit ] && [ ! -f .husky/_/husky.sh ] && npx husky install
```

## Test Account Fallback (UAT, all markets)

The credential file `integration_test/src/env/uat-{market}.env` has 5+ accounts. Try in this order (3-attempt cap per `common-web-visual-testing/login-and-test-data.md`):

| Order | Account key      | Password key     | Role          |
| ----- | ---------------- | ---------------- | ------------- |
| 1     | `client_user`    | `client_pwd`     | client_user   |
| 2     | `client_user_2`  | `client_pwd_2`   | client_user   |
| 3     | `client_user_5`  | `client_pwd_5`   | myclientuser (cross-market access) |

**`myclientuser` (account 5)** has access across multiple markets — useful when the first 2 fall through.

> **Note:** env file format has spaces before `=` on entries 3-5 (e.g. `client_user_3 =auto2_test`) — handle with `grep -E "^client_user_5\s*="`.

## Customer-Picker Dialog Handling

After login, the user must select a delivery customer before the search bar enables. The picker is multi-section — clicking the FIRST section's customer rows often does nothing (it's a recently-viewed cache); the actual selectable list is in the LOWER section with `[separator]` elements between rows.

```bash
# Select first SELECTABLE customer (lower section), then Confirm
SNAP=$(playwright-cli -s={SESSION} snapshot 2>&1)
LOWER_ROW=$(echo "$SNAP" | sed -n '180,260p' | grep -B1 'Customer Code:' | head -1 | grep -oE 'ref=e[0-9]+' | head -1 | sed 's/ref=//')
playwright-cli -s={SESSION} click "$LOWER_ROW"
sleep 2
CONFIRM=$(playwright-cli -s={SESSION} snapshot 2>&1 | grep -oE 'button "Confirm" \[ref=e[0-9]+\]' | head -1 | grep -oE 'e[0-9]+' | head -1)
playwright-cli -s={SESSION} click "$CONFIRM"
```

## SearchBar Market Quirk

`useCategorySearchHeader.tsx` gates `enableSearchWithCategory` on `isMYMarket && featureFlag.enable_search_with_category === 'true'`. Result:

- **MY market**: search dropdown shows TRENDING categories section → empty wrapper bug HIDDEN by content
- **Non-MY (SG/TH/PH/etc.)**: dropdown variant has no trending → empty wrapper bugs VISIBLE

For SearchBar verification, **always test on a non-MY market** (SG is the default reference).

## Worktree node_modules Strategy

Worktrees from `make worktree-add` don't inherit node_modules. Symlink to avoid 5-min reinstall:

```bash
SRC=/Users/.../datasource/frontend
WT=/Users/.../datasource/worktrees/{TICKET}/frontend
[ -d "$SRC/node_modules" ] && [ ! -e "$WT/node_modules" ] && ln -s "$SRC/node_modules" "$WT/node_modules"
```

Safe because the worktree shares the parent repo's git history → same `package-lock.json` → same dep tree.

## PR Evidence Attachment (ADO)

ADO MCP (`mcp__azure_devops__*`) doesn't expose a PR-attachment-upload tool. Use raw REST POST with `az`-CLI bearer for inline-renderable image embeds:

```bash
ADO_TOKEN=$(az account get-access-token --resource 499b84ac-1321-427f-aa17-267ca6975798 --query accessToken -o tsv)
curl -sS -X POST -H "Authorization: Bearer $ADO_TOKEN" -H "Content-Type: application/octet-stream" \
  --data-binary "@<file.png>" \
  "https://dev.azure.com/{ORG}/{PROJECT}/_apis/git/repositories/{REPO_NAME}/pullRequests/{PR_ID}/attachments/<filename>?api-version=7.1"
# Response: {"url": "https://dev.azure.com/.../attachments/<filename>", ...}
# Embed in PR description / threads as: ![alt](returned-url)
```

Method is **POST** (PUT returns 405). JIRA URLs render as text-links (cross-domain auth) — only ADO same-origin URLs render inline.

## Anti-Patterns (project-specific)

- **No assuming shell-export overrides .env**: env-cmd overwrites shell vars. Edit `.env` directly with backup/restore.
- **No skipping `.env` restore on cleanup**: `mv env-backup-original .env` BEFORE removing other artifacts.
- **No verifying SearchBar on MY market**: TRENDING section masks empty-wrapper bugs. Use SG/TH/PH.
- **No iterating account list past 3 attempts**: Cascade-locks team test accounts.
- **No JIRA URLs as inline embeds in ADO**: Cross-domain auth blocks. Upload to ADO via REST.
- **No UAT navigation pre-commit**: Localhost only. UAT serves the deployed build, not your fix.


---

## quality-engineering-quality-assurance

### TDD_FEEDBACK

# TDD & Feedback Reference

Example of the Red-Green-Refactor cycle and code review feedback.

## 🔴 Step 1: Red (Test First)

```typescript
test('should calculate discount correctly', () => {
  const calculator = new DiscountCalculator();
  expect(calculator.calculate(100)).toBe(90); // Fails: Calculator not implemented
});
```

## 🟢 Step 2: Green (Implement)

```typescript
class DiscountCalculator {
  calculate(price: number) {
    return price * 0.9; // Pass
  }
}
```

## 🔵 Step 3: Refactor (Optimize)

```typescript
class DiscountCalculator {
  private static readonly DEFAULT_DISCOUNT = 0.9;

  calculate(price: number): number {
    return price * DiscountCalculator.DEFAULT_DISCOUNT;
  }
}
```

## 🤝 Code Review Examples

- **BAD (Destructive)**: "This code is slow and messy. Change it."
- **GOOD (Constructive)**: "The nested loop here might lead to $O(n^2)$ complexity. Can we use a Map for $O(1)$ lookups instead?"


---

### test_case_standards

# Test Case Creation Standards

## 1. Granularity Guidelines

- **Split by Screen**: Even if features align, separate TCs for "Order Details" vs "Item Details".
  - _Reasoning_: UI implementation differs; bugs are often screen-specific.
- **Split by Condition**: Separate TCs for each configuration path (e.g., "Config A" vs "Config B").
  - _Reasoning_: Traceability; failures point to specific configs.
- **No "OR" Logic**: Each TC must test a single, distinct path.

## 2. Naming Convention

**Pattern**: `[Platform_]Module_Action on Screen when Condition`

| Component     | Description        | Example                       |
| :------------ | :----------------- | :---------------------------- |
| **Platform**  | Optional prefix    | `Web_`, `Mobile_`             |
| **Module**    | High-level feature | `Order`, `Login`, `Payment`   |
| **Action**    | What is verified   | `Verify payment term`         |
| **Screen**    | Specific UI screen | `item details screen`         |
| **Condition** | State/Role/Config  | `Enable Payment Terms is OFF` |

### Platform Prefix Rules

- **Include** `Web_` or `Mobile_` ONLY if the requirement is exclusive to one platform.
- **Omit** the prefix if the test case applies to both Web and Mobile.

### Examples

✅ **Good**:

- `Order_Verify payment term on item details screen when Enable Payment Terms is OFF` (Applies to both)
- `Web_Order_Verify pagination on item list screen when more than 50 items` (Web exclusive)
- `Mobile_Order_Verify pull-to-refresh on item list screen` (Mobile exclusive)

❌ **Bad**:

- `Verify Payment Terms Visibility (Disabled)` (Ambiguous screen)
- `Check Payment Terms` (Vague action)
- `Web_Login_Verify login on login screen` (Omit prefix if behavior is identical on both)

## 3. Priority Levels

- **High**: Critical paths, blockers, core logic.
- **Normal**: Standard validation, edge cases.
- **Low**: Cosmetic, minor improvements.


---

## quality-engineering-zephyr-coverage-analysis

### coverage_report_template

# Coverage Analysis Report Template

## Section 1 — Executive Dashboard

```bash
## Coverage Dashboard — {JIRA_KEY}: {Summary}
Date: {today} | Market: {market} | Component: {component}

| Metric                   | Value     |
|--------------------------|-----------|
| Total AC-Platform Slots  | N         |
| Covered                  | N (XX%)   |
| Partial                  | N (XX%)   |
| Not Covered              | N (XX%)   |
| Web Coverage             | N/M (XX%) |
| Mobile Coverage          | N/M (XX%) |
| Existing TCs Found       | N         |
| Proposed New TCs         | N         |
| QE Debt Items Identified | N         |
```

> **Release Readiness verdict**: one sentence on whether coverage is sufficient to release.

## Section 2 — AC Coverage Heatmap

| AC  | Platform   | Behavior Summary | Mapped TC(s) | Status      | Risk | Gap Reason                                   |
| --- | ---------- | ---------------- | ------------ | ----------- | ---- | -------------------------------------------- |
| AC1 | Web        | ...              | {PROJECT}-T9937   | Partial     | HIGH | Generic objective, no field-level validation |
| AC2 | Mobile     | ...              | —            | Not Covered | HIGH | No TC found                                  |
| AC3 | Web+Mobile | ...              | {PROJECT}-T9940   | Covered     | —    | —                                            |

Risk scoring: **HIGH** = transaction/financial/order completion | **MEDIUM** = feature behavior/conditional display | **LOW** = UI/visual/cosmetic

## Section 3 — Quality Observations on Existing TCs

For each Partial or questionable TC:

- **Traceability gap**: objective references wrong ticket key
- **Generic objective**: verifies existence but no assertion on business logic
- **Step masking**: multiple ACs in one TC — failure cannot be attributed to one AC
- **Missing data-correctness assertion**: fields displayed but values not validated

## Section 4 — QE Debt (Missing Coverage Categories)

- **Data correctness**: financial values validated against DB, not just displayed?
- **Negative flows**: behavior when backend integrations are unavailable?
- **Role differentiation**: role-specific paths untested?
- **Boundary conditions**: edge cases (empty cart, misconfigured rules)?
- **Regression risk**: existing TCs in other tickets relying on the same screens?

| ID  | Item | Priority | Rationale |
| --- | ---- | -------- | --------- |
| D1  | ...  | P2       | ...       |

## Section 5 — Prioritized Action Plan

### P1 — Must Complete Before Release (Blocker Risk)

| #   | Action            | AC      | Rationale |
| --- | ----------------- | ------- | --------- |
| 1   | Create TC: [Name] | AC1 Web | [reason]  |

### P2 — Should Complete (High Confidence)

| #   | Action | AC  | Rationale |
| --- | ------ | --- | --------- |

### P3 — Nice to Have (Risk Accepted)

| #   | Action | AC  | Rationale |
| --- | ------ | --- | --------- |

### QE Debt — Backlog for Next Sprint

| #   | Action | Rationale |
| --- | ------ | --------- |

## Section 6 — Recommendations for QE Manager

1. **Release readiness**: sufficient to release? Risk if P1 items are not created?
2. **QE team actions**: TCs to create/update before sprint ends?
3. **Process improvement**: structural issues (combined TCs, wrong labels, generic objectives)?


---

## quality-engineering-zephyr-test-generation

### impact_analysis

# Test Case Impact Analysis (Regression Management)

## Goal

Systematically identify and update existing Zephyr Test Cases affected by new requirements to prevent technical debt and outdated test suites.

## 0. Discovery Protocol (Finding Existing TCs)

Use a multi-pass discovery strategy, starting with the fastest direct lookup.

### Pass 0 — Direct Issue Link Lookup (Primary — always run first)

Use `Get Issue Link Test Cases` MCP tool with the Jira issue key (e.g., `{PROJECT}-{ID}`).
Returns all TCs formally linked to the issue in a single call. This is the fastest and most reliable method.

For each returned TC key, use `Get Test Case` to fetch full details.

### Pass 1 — Supplemental Search (only if Pass 0 yields < 3 TCs)

Use `Get Test Cases` with `projectKey={PROJECT}` and `limit=100` to fetch recent TCs. Filter **client-side**:

- **Objective match:** TCs where `objective` text contains the issue key string

Deduplicate against Pass 0 results.

### Pass 2 — Keyword Fallback (only if Pass 0+1 yield < 3 TCs)

- **Keyword Search**: Search `name` for `[Module]` and `[Screen]` keywords (e.g., "Order History Payment").
- **Link Check**: Use `Get Test Case Links` on candidates to check COVERAGE links to related issues.
- **Folder Audit**: Navigate to the Zephyr folder for the feature area (e.g., `features/order_history`).
- **Sibling Analysis (Jira)**: Find issues sharing the same **Component** or **Labels**; search their linked TCs.

## 1. Identification (Delta Analysis)

- **Step 1**: Search Zephyr for existing TCs mapped to the feature/module in the Jira US.
- **Step 2**: Compare current TC steps with the new Acceptance Criteria (AC).
- **Step 3**: Identify the **Delta** (What changed? What was added? What was removed?).

## 2. Decision Matrix: Update vs. Create New

| Condition        | Action                 | Rationale                                                    |
| :--------------- | :--------------------- | :----------------------------------------------------------- |
| **Logic Shift**  | **Update Existing**    | intent same, behavior evolved (e.g., modified pricing).      |
| **New Platform** | **Create New**         | Requirement expands from Web to Mobile with unique behavior. |
| **New Market**   | **Create New**         | Adding unique Market rule (e.g., VN-only pricing).           |
| **New Branch**   | **Create New**         | Adds parallel condition (e.g., new Sales Org).               |
| **Deprecation**  | **Deactivate/Archive** | Logic no longer valid or completely replaced.                |

## 3. Update Procedure (Requires User Approval)

1. **Fetch**: Read the latest version of the existing TC using `Get Test Case Steps`.
2. **Merge**: Apply the deltas to the steps while preserving unchanged valid steps.
3. **Verify**: Ensure the updated TC still follows [Granularity Standards](../../quality-engineering-quality-assurance/references/test_case_standards.md).
4. **Present Diff (MANDATORY)**: Show the user a clear before/after comparison of every field and step that will change. Wait for explicit user approval ("yes", "approve", "proceed", or equivalent) before continuing.
5. **Publish**: Only after approval, update the TC using `Update Test Case` (this normally increments the version).

## 4. Documentation

- Add a comment to the TC: `Updated per [JIRA-ID]: {Summary of change}`.
- Ensure the Jira-Zephyr link is updated if necessary.


---

### tc_format

# TC Artifact Format Reference

## zephyr_test_plan.md — 4-section structure

### Section 1 — Existing TCs

`TC Key | Platform | Objective` (3-column table)

### Section 2 — AC Coverage Map

`AC | Platform | Status | Risk | Existing TC | Gap | New TC` (7-column table)

- Status: `Covered` / `Partial` / `Not Covered`
- Risk: `HIGH` / `MEDIUM` / `LOW` / `—`

### Section 3 — QE Debt (if any)

`ID | Item | Priority | Rationale` (4-column table)

### Section 4 — Proposed Test Cases

Open with an Index table, then one `###` block per TC:

```bash
### Index
| TC  | Name              | Platform | Priority | AC  |
|-----|-------------------|----------|----------|-----|
| TC1 | Web_Module Name | Web      | High     | AC1 |

---

### TC1 · Web_Module Name · AC1

- **Platform**: Web
- **Priority**: High
- **Status**: Draft
- **Labels**: VNS-Market, {PROJECT_KEY}-{ID}
- **Roles**: Client user, Client admin, Internal sales rep, External sales rep (or any other exact role from Confluence like Zp admin, Root admin)
- **Objective**: Verify [behavior]. Covers AC1.

**Preconditions**:
- [bullet list — NOT inside a table cell]

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Login to {APP_NAME} as a VN {APP_NAME}+ user | {APP_NAME} homepage is displayed |
| 2 | Add data to cart → navigate to target screen | User is on [screen] |
| 3 | Verify [element or behavior] | [Observable outcome] |
```

## Step Writing Rules

- **Split Step 1**: Login = its own step. Step 2 = data setup + navigate.
- **Short cells**: ≤80 chars. Use `→` for navigation chains.
- **No verbatim quotes**: Describe intent, not full quoted text.
- **Combine trivials**: `price reads "FREE" and "Bonus" tag visible` = one step.
- **Expand options**: Each screen/config variant in Given/When = separate step.

## After Writing the File

Read back `zephyr_test_plan.md` and print its full content in the chat response — user reviews rendered markdown in-conversation, no file opening needed.


---

