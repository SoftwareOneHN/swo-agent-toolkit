---
inclusion: manual
---

# Skills: quality-engineering

> 7 skills. Load when editing quality-engineering files.
> For code examples and implementation patterns, load `refs-quality-engineering.md`.

## Index

# quality-engineering Skills Index

## File Match (auto-check against the file you are editing)

| Skill | File pattern | Keywords |
| ----- | ------------ | -------- |
| **quality-engineering-business-analysis** | `**/user_story.md` | acceptance criteria, AC, business rules, jira story, toggle, market, write user story, improve user story, review story, BA |
| quality-engineering-zephyr-coverage-analysis | `coverage_analysis_report.md` | coverage analysis, test coverage, coverage gaps, QE debt, QE audit, pre-release readiness, sprint readiness, zephyr coverage, test gap, AC coverage, test-ready |
| quality-engineering-zephyr-test-generation | `**/user_story.md` | generate test cases, zephyr, impact analysis, create test case |

## Keyword Match (only when user's request mentions these)

| Skill | Match when user mentions |
| ----- | ----------------------- |
| quality-engineering-appium-mcp | appium, mobile verify, android verify, ios verify, lambdatest, real device cloud, flutter widget tap |
| quality-engineering-jira-integration | jira issue, zephyr link, has-zephyr-tests, traceability, link test case |
| quality-engineering-playwright-cli | playwright-cli, browser automation, web verify, browser navigate, page verification |
| quality-engineering-quality-assurance | test case, manual test, zephyr, test scenario, naming convention, acceptance criteria |

> Load matched skills: `<SKILLS>/quality-engineering/<skill>/SKILL.md`. Load ALL that match — the tier model already filters irrelevant ones.


---

## Skills

### quality-engineering-appium-mcp

---
name: quality-engineering-appium-mcp
description: Drives iOS/Android mobile devices via Appium MCP. Use for verifying mobile bugs, E2E tests, and navigating real device clouds (LambdaTest/BrowserStack).
metadata:
  triggers:
    keywords:
    - appium
    - mobile verify
    - android verify
    - ios verify
    - lambdatest
    - real device cloud
    - flutter widget tap
---

# 📱 Appium MCP (Mobile Automation)

## **Priority: P1 (HIGH)**

> [!IMPORTANT]
> **Tier 0 (Infrastructure)**: Session creation, device farm connectivity, basic OS interactions.
> **Tier 1 (Core Gestures)**: Taps, swipes, text input for native mobile elements.
> **Tier 2 (Flutter/Single-Canvas)**: Visual-first automation via screenshot + coordinate taps.

## 🔌 Activation

**Triggers**: `appium`, `mobile verify`, `android verify`, `ios verify`, `lambdatest`, `real device cloud`, `flutter widget tap`.

## 🛠 Core Workflow (Goal-Oriented)

| Step | Tool | Purpose |
| :--- | :--- | :--- |
| 1 | `appium_session_management` (`create`) | Open session. **Resiliency**: Retry with `noReset: true` on failure. |
| 2 | `appium_get_window_size` | Scale coordinates for high-density displays. |
| 3 | `appium_screenshot` | Capture visual state for **Semantic Reasoning**. |
| 4 | `appium_gesture` / `appium_set_value` | Interact. **Self-Healing**: Re-scan hierarchy if UUID stale. |
| 5 | `appium_session_management` (`delete`) | **MANDATORY Cleanup**. |

## 💡 AI-Driven Methodologies
- **Semantic Intent**: Find element in hierarchy (e.g., "Login button") instead of raw coordinates. Resilient to layout shifts.
- **Dynamic Handling**: Unexpected pop-up appears? Pause, reason about alert, dismiss, resume.
- **Visual Anchors**: Find stable "Anchor" (e.g., Header) and derive coordinates relative to it.

## 🚫 Anti-Patterns (Zero-Tolerance)

- **Hardcoded XPaths**: Use `accessibility id` or `uiautomator`. XPath flaky.
- **Implicit Wait-Only**: Never assume page loaded. Poll for "Source of Truth" element.
- **Ignoring QoS**: Audit CPU/Memory via `appium_mobile_performance_data`. Prevent lag/crashes.
- **Orphaned Sessions**: Teardown mandatory. Call `delete` in cleanup block.

## ✅ Evaluation Criteria

- **Cleanup Rate**: 100% session closure.
- **Visual Accuracy**: Coordinate-based taps land within 5% of target center.
- **Security**: No secrets in tool arguments or logs.

## 🔗 References

- **Visual Testing**: [common-mobile-visual-testing](../../common/common-mobile-visual-testing/SKILL.md) — Methodology for what to verify.
- **LambdaTest Setup**: [lambdatest-cloud-setup](references/lambdatest-cloud-setup.md) — RDC configuration.
- **Tool Cheatsheet**: [tool-cheatsheet](references/tool-cheatsheet.md) — Fast copy-paste args.
- **Project Context**: [project-context](references/project-context.md) — Project-specific overlays/macros.


---

### quality-engineering-business-analysis

---
name: quality-engineering-business-analysis
description: 'Investigate requirements with atomic AC decomposition, actor/permission matrix, platform parity audit, truth table verification, and edge case discovery. Also enforces User Story authoring standards: story structure, scope fences, platform tags, toggle contracts, market isolation, and deferral patterns. Use when writing, reviewing, or improving User Stories, acceptance criteria, or doing impact analysis — especially for stories with multi-condition AC, feature toggles, market variants (VN/MY/SG), or undefined platform behavior.'
metadata:
  triggers:
    files:
    - '**/user_story.md'
    keywords:
    - acceptance criteria
    - AC
    - business rules
    - jira story
    - toggle
    - market
    - write user story
    - improve user story
    - review story
    - BA
---
# Business Analysis Standards (Deep Analysis + Story Authoring)

## **Priority: P0 (CRITICAL)**

## 1. Deep Investigation Protocol

- **Atomic AC Decomposition**: Split **Acceptance Criteria (AC)** into **1-Condition** logic units (e.g., "User can X and Y" -> "User can X", "User can Y").
- **Variable Identification**: Extract all **Feature Toggles**, **Market Rules** (VN/MY/SG), and **User Roles**.
- **Platform Parity**: Verify if logic applies to both **Web** and **Mobile**; Flag divergent behavior early.
- **Truth Table Verification**: Map complex multi-condition logic to **Logic Truth Table**.

## 2. Dynamic Actor & Permission Mapping

- Identify all **Actors** (e.g., `Customer`, `Sales Rep`, `Admin`).
- Use **Actor/Permission Matrix** to map specific constraints per Actor.
- [Permissions Patterns](references/analysis_patterns.md)

## 3. Edge Case & Boundary Analysis

- **State Validation**: Verify behavior across all entity (e.g., `Active`, `Suspended`) and network states.
- **Boundary Detection**: Analyze **currency**, **date**, and **count limits**.
- **Negative Testing**: Identify flows for **Unauthorized Access**, **Invalid Input**, and **Null-safety**.

## 4. Anti-Patterns (Analysis)

- **No Surface Reading**: investigate _implications_, don't restate.
- **No Assumption**: Flag undefined states (e.g., Offline) as P0 blockers.
- **No Loose Mapping**: Ensure AC aligns 100% with Technical Impact notes.

## 5. User Story Authoring Standards

- **Story Structure**: Every story must use `As a [Actor], I want [Goal], so that [Value]`.
- **AC Format**: Each AC must one `Given / When / Then` block — one condition per block.
- **Platform Tag**: Prefix each AC with `[WEB]`, `[MOBILE]`, or `[BOTH]` — never mix platforms in one AC block.
- **Toggle Contract**: Each feature flag AC must name flag and state: `Toggle: <FlagName> = ON/OFF`.
- **Market Isolation**: Any market-specific AC must prefixed `[Market: VN]`, `[Market: MY]`, etc.
- **Scope Fence**: Include explicit `## In Scope`, `## Out of Scope`, and `## Deferred` sections. Deferred items must link to Jira ticket — never write "to discuss".
- **Translation AC**: Language/locale behavior separate AC, not inline note.

See [User Story Template](references/user_story_template.md) for full authoring template.

## 6. Anti-Patterns (Story Authoring)

- **No mixed-platform AC**: `[MOBILE ONLY]` buried inline hides parity gaps — use platform tags.
- **No "to discuss"**: Replace with linked Jira ticket in `## Deferred`.
- **No implicit toggle states**: Always declare both ON and OFF behavior per AC.
- **No bundled AC**: "User sees X and Y and Z" → split into three separate AC blocks.

## 7. Validation Checklist

Run after authoring or reviewing any User Story before marking it ready for development:

- [ ] Every AC `[WEB]`, `[MOBILE]`, or `[BOTH]` platform tag
- [ ] Every toggle AC declares both `= ON` and `= OFF` states explicitly
- [ ] No AC block contains more than one `And` condition (split if it )
- [ ] No "to discuss" text anywhere — replaced by Jira link in `## Deferred`
- [ ] Story `## In Scope`, `## Out of Scope`, and `## Deferred` sections
- [ ] Story uses `As a / I want / So that` header
- [ ] Market-specific ACs prefixed `[Market: VN]`, `[Market: MY]`, etc.
- [ ] Translation / locale behavior its own AC or deferred with Jira link

---

### quality-engineering-jira-integration

---
name: quality-engineering-jira-integration
description: "Jira ↔ Zephyr traceability: fetch story AC and components, detect existing TC links, link new Zephyr TCs back to Jira, and apply has-zephyr-tests labels. Use after creating Zephyr test cases that need linking, when fetching a Jira story's details for test generation, or when auditing and cleaning up stale TC links."
metadata:
  triggers:
    keywords:
    - jira issue
    - zephyr link
    - has-zephyr-tests
    - traceability
    - link test case
---
# Jira Integration Standards

## **Priority: P1 (HIGH)**

## 1. Retrieving Issue Details

- **Fetch Core Info**: Retrieve **Summary**, **Description**, **Acceptance Criteria (AC)**, and **Components**.
- **Jira Key**: ALWAYS reference issue by its unique **Jira Ticket ID** (e.g., `TICK-123`).
- **Sibling Analysis**: Identify other Jira issues with same **Component** or **Market Variants** (VN/MY/SG) to find potentially impacted Zephyr TCs.
- **Identify Links**: Use `Get Issue Link Test Cases` with Jira issue key to check for existing linked TCs before creating duplicates.
- **Actor Mapping**: Extract reporter, assignee, and **Story Points** for context.

## 2. Linking Zephyr Test Cases

- **Traceability**: After creating Zephyr Test Case, link it back to corresponding Jira Issue using **Remote Link** or **Zephyr Issue Link**.
- **Format**: Use Zephyr Scale key (e.g., `PROJ-T123`) in Jira link or comment.
- **Labels**: Apply **`has-zephyr-tests`** label to Jira issue once test cases successfully linked.

## 3. Jira-Zephyr Workflow

1. **Fetch**: Get Jira User Story details.
2. **Generate**: Create Zephyr Test Case using generation skill.
3. **Link**: Use SmartBear MCP tool **`Create Test Case Issue Link`** to bridge two.
4. **Notify**: Add comment to Jira: `Linked Zephyr Test Case: {test_case_key}`.

## 4. Best Practices

- **Concise Summaries**: Keep Jira comments professional and brief.
- **Traceability Matrix**: Ensure every AC in Jira at least one linked Zephyr Test Case.
- **Cleanup**: Remove unused labels or outdated links during refactors.

## 5. Anti-Patterns

- **No Ghosting**: Create tests then link to Jira (Traceability).
- **No Spam**: Post single comment per link.
- **No Missing Labels**: Update Jira labels after linking.

---

### quality-engineering-playwright-cli

---
name: quality-engineering-playwright-cli
description: Standardizes token-efficient browser automation via playwright-cli. Use for web verification, navigation, and capturing snapshots/logs.
metadata:
  triggers:
    keywords:
    - playwright-cli
    - browser automation
    - web verify
    - browser navigate
    - page verification
---

# 🎭 Playwright CLI (Web Automation)

## **Priority: P1 (HIGH)**

> [!IMPORTANT]
> **Tier 0 (Infrastructure)**: Browser process management, named sessions, network/console logs.
> **Tier 1 (Core Interactions)**: Clicks, fills, and navigation (`open` vs `goto`).
> **Tier 2 (Verification)**: Snapshot-based assertions and auth state persistence.

## 🔌 Activation

**Triggers**: `playwright-cli`, `browser automation`, `web verify`, `snapshot`, `auth-state.json`.

## 🛠 Core Workflow

| Step | Command | Purpose |
| :--- | :--- | :--- |
| 1 | `playwright-cli -s={ID} open <url>` | Start **named session**. (Mandatory `-s=`). |
| 2 | `playwright-cli -s={ID} snapshot --aria` | **Aria Snapshot**: YAML-like view for LLM reasoning (Best for assertions). |
| 3 | `playwright-cli -s={ID} console` | Check for JS errors/warnings. |
| 4 | `playwright-cli -s={ID} screenshot` | Visual evidence. Use `--mask <ref>` for dynamic content. |
| 5 | `playwright-cli -s={ID} close` | **MANDATORY Cleanup**. |

## 💡 Agent-Native Optimization
- **Aria-First**: Use `snapshot --aria` as primary way to "see" page. Filters noise.
- **Robust Locators**: Prefer Role-based references (e.g. `button[name="Submit"]`) over fragile CSS classes.
- **Visual Stability**: evaluated `document.body.style.animation = 'none'` to freeze animations before capture.

## 🚫 Anti-Patterns (Zero-Tolerance)

- **Unnamed Sessions**: Never omit `-s=`. Bare commands collide across concurrent runs.
- **Double Open**: Use `open` for first run; `goto` for mid-session navigation.
- **Unmasked Snapshots**: Mask clocks/random IDs before comparison to avoid false positives.
- **Orphaned Processes**: Always `close` session, even on failure.

## ✅ Evaluation Criteria

- **Cleanup Rate**: 100% session closure.
- **Assertion Quality**: 90% of assertions use `snapshot` rather than pixels.
- **Auth Persistence**: Successful re-use of `state-load` for multi-step flows.

## 🔗 References

- **Web Visual Testing**: [common-web-visual-testing](../../common/common-web-visual-testing/SKILL.md) — Methodology for what to verify.
- **Anti-Patterns Rationale**: [anti-patterns-rationale](references/anti-patterns-rationale.md) — Why these rules exist.
- **Project Context**: [project-context](references/project-context.md) — Project-specific market/VPN/auth patterns.


---

### quality-engineering-quality-assurance

---
name: quality-engineering-quality-assurance
description: Write manual test cases with 1-condition-per-TC granularity, Module_Action on Screen when Condition naming, platform prefix rules, and High/Normal/Low priority classification. Use when writing or reviewing manual test cases for Zephyr — to split compound TCs, fix naming violations, assign correct platform tags, or determine bug priority.
metadata:
  triggers:
    keywords:
    - test case
    - manual test
    - zephyr
    - test scenario
    - naming convention
    - acceptance criteria
---
# Quality Assurance Standards

## **Priority: P1 (HIGH)**

## 1. Test Case Granularity

- **1 Test Case = 1 Condition on 1 Screen**.
 - **Split Screens**: "Order Details" & "Item Details" separate.
 - **Split Conditions**: "Config " & "Config B" separate.
- **No "OR" Logic**: Each TC must test single, distinct path.

## 2. Naming Convention

- **Pattern**: `Platform_Module_Action on Screen when Condition` (e.g., `Web_Order_Verify...` or `Mobile_Order_Verify...`)
- **Rule**: Only include `Web_` or `Mobile_` prefix if requirement exclusive to one platform. Omit prefix if it supports **Both**.
- **Example**: `Order_Verify payment term on Item Details when Toggle is OFF` (Supports Both)

## 3. Priority Levels

Use priority rationale to justify each classification:

- High: Critical path, blocker bug.
- Normal: Standard validation, edge case.
- Low: Cosmetic, minor improvement.

## 4. References

- [Detailed Examples](references/test_case_standards.md)

## Anti-Patterns

- **No Broad TCs**: `"Verify order flow works"` — too broad; every TC must cover exactly 1 condition on 1 screen
- **No Shared TCs (Divergent)**: Testing Web and Mobile behavior in single TC when behavior diverges — split into separate TCs per platform
- **No Incomplete Naming**: `Order_Verify page` — name must follow full pattern: `Module_Action on Screen when Condition`
- **No Priority Inflation**: Marking cosmetic spacing bug as High priority — reserve High for critical path blockers only

---

### quality-engineering-zephyr-coverage-analysis

---
name: quality-engineering-zephyr-coverage-analysis
description: Audit test coverage health, gaps, and QE debt for Jira stories or epics. Produces coverage_analysis_report.md with AC-to-TC heatmap, risk scores, and prioritized action plan. Use when assessing coverage percentage, pre-release readiness, sprint readiness, or identifying missing test cases. Do NOT use for TC creation — use zephyr-test-generation instead.
metadata:
  triggers:
    files:
    - 'coverage_analysis_report.md'
    keywords:
    - coverage analysis
    - test coverage
    - coverage gaps
    - QE debt
    - QE audit
    - pre-release readiness
    - sprint readiness
    - zephyr coverage
    - test gap
    - AC coverage
    - test-ready
---
# Zephyr Coverage Analysis

## **Priority: P1 (HIGH)**

## Workflow

> **CRITICAL — Read and follow workflow file exactly. NOT implement from memory or from this description.**
> Implementing inline bypasses `jira-analyst` and `zephyr-scanner` sub-agents.

Read and execute `.agents/workflows/zephyr-coverage-analysis.md`.

## Anti-Patterns

- **No TC creation**: Analysis read-only — call quality-engineering-zephyr-test-generation to create TCs.
- **No pagination-first**: Always use `Get Issue Link Test Cases` (direct lookup) before falling back to pagination.
- **No ticket-level platform**: Read Platform from each AC table row HTML, not ticket header section.
- **No merged WEB+MOBILE slots**: Treat each platform as independent coverage slot — Mobile covered ≠ Web covered.
- **No skipping QE debt**: Scan beyond AC rows — always include data correctness, negative flows, role differentiation, and regression risk in Section 4.

## References

- [Report Template](references/coverage_report_template.md) — load when building coverage_analysis_report.md (Step 5 of workflow)
- [Impact Analysis Protocol](../quality-engineering-zephyr-test-generation/references/impact_analysis.md) — TC discovery protocol
- [Zephyr Test Generation](../quality-engineering-zephyr-test-generation/SKILL.md) — invoke after analysis to create missing TCs

---

### quality-engineering-zephyr-test-generation

---
name: quality-engineering-zephyr-test-generation
description: 'Generate Zephyr test cases from Jira stories: parse AC, identify platform and market, impact-analyze existing TCs (update vs create new), draft test cases with correct naming/metadata/preconditions, and link back via Create Test Case Issue Link. Use when converting a Jira story into Zephyr TCs, or when requirement changes require updating existing TCs rather than creating duplicates.'
metadata:
  triggers:
    files:
    - '**/user_story.md'
    keywords:
    - generate test cases
    - zephyr
    - impact analysis
    - create test case
---
# Zephyr Test Generation Standards

## **Priority: P1 (HIGH)**

## Workflow: Jira → Zephyr

1. **Analyze Requirements**:
 - Extract: Summary, ACs, Platform per AC row, Market, Components.
 - Fetch Jira with `?expand=renderedFields` — HTML authoritative for platform colors:
 `#00B8D9` = Web · `#36B37E` = Mobile · `#FF991F` = Web+Mobile
 - See [Actor/Permission Matrix](../quality-engineering-business-analysis/references/analysis_patterns.md) for role/market logic.

2. **Impact Analysis** (run before any TC creation)
 - **Step — Direct Lookup**: Call `Get Issue Link Test Cases` with Jira issue key (e.g., `{PROJECT}-{ID}`).
 - **Step B — Supplemental**: If Step 0, search by `[Module]` and `[Screen]` keywords + check sibling issue links.
 - See [Discovery Protocol](references/impact_analysis.md) for full chain.
 - Map each AC to coverage status:
 - **Covered** → ask user: skip or update to current format?
 - **Partial** → always propose NEW TC.
 - **Not Covered** → always create NEW TC.

3. **Draft Artifact**:
 - Delete any existing `zephyr_test_plan.md` before writing.
 - Follow 4-section format in [TC Format Reference](references/tc_format.md) exactly.
 - After writing: read back file and print full content in chat so user can review without opening it.
 - Ask for: review approval, handling of Covered ACs, and Zephyr Folder ID.

4. **Create in Zephyr** (after explicit user approval)
 - `Create Test Case` (with `customFields` included — no separate Update needed) → `Create Test Case Steps` → `Create Test Case Issue Link`
 - For **updates** to existing TCs: fetch current steps via `Get Test Case Steps`, show before/after diff, wait for explicit approval, then `Update Test Case`.

## Platform Rules

| AC row | Action |
| ------------------------------------------- | --------------------------------------------------------------- |
| Single row `[ WEB + MOBILE ]` | ONE TC, Platform = "Web and Mobile", no platform prefix in name |
| Two rows same behavior, different platforms | TWO TCs with `Web_` / `Mobile_` prefix — never merge |

## Naming & Filing

- **Name**: Prefix `Web_` / `Mobile_` only when platform-exclusive; omit prefix for Web and Mobile.
- **Folder**: Use exact Folder ID provided by user or specified in Technical Impact.

### Role Mapping Rule

- **CRITICAL**: If Acceptance Criteria uses generic terms like "user", "buyer", or "customer" in ordering/checkout context, it MUST mapped to ALL purchasing roles: `["Client user", "Client admin", "Internal sales rep", "External sales rep"]`. not default to `Client user`.

## API Critical Notes (SmartBear MCP — `@smartbear/smartbear-mcp`)

- **`Create Test Case`** requires `projectKey="{PROJECT}"` and supports `customFields` directly (no separate Update needed for Roles/Platform).
- **`Create Test Case Steps`** uses `testCaseKey` + `mode` (APPEND/OVERWRITE) + `items[]`.
- **`Create Test Case Issue Link`** uses `testCaseKey` + `issueId` (numeric Jira issue ID — get from ticket's `id` field, not key string).
- **`Get Issue Link Test Cases`** uses `issueKey` (e.g., `{PROJECT}-{ID}`) — returns linked TC keys directly.
- **`Update Test Case`** uses `testCaseKey` — only needed when modifying existing TCs, not for new creation.

## Anti-Patterns

- **No prefix omission**: TC name sent to Zephyr API must include `Web_` or `Mobile_` prefix for platform-exclusive TCs — copy verbatim from artifact draft; omit prefix only when Platform = "Web and Mobile".
- **No Draft skip**: Always set status = Draft; never auto-approve.
- **No flat folderId**: Use `"folder": {"id": X}` in all PUT payloads.
- **No WEB+MOBILE split**: One AC row = one TC with Platform "Web and Mobile".
- **No platform merge**: Two AC rows, different platforms = two separate TCs.
- **No silent update**: Show before/after diff; wait for explicit approval.
- **No lookup skip**: Always run Step direct link lookup before supplemental search.
- **No stale artifact**: Delete existing `zephyr_test_plan.md` before each run.
- **No coverage skip**: Coverage Analysis table must open every artifact.
- **No ghost update**: Update Zephyr TC whenever matching code changes.
- **No vague steps**: Use specific observable outcomes — e.g., `"System works"` → `"Banner 'Success' is visible"`.

---

