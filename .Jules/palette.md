## 2026-07-13 - [Tooltip Interaction and Nesting Patterns]
**Learning:** When combining Radix UI Tooltips with other interactive components like Dropdown Menus, it's essential to follow a specific nesting order (Tooltip > TooltipTrigger > DropdownMenuTrigger > Button) for correct accessibility and event handling. Additionally, automated verification via Playwright requires explicit mouse resets and delays to capture entry animations.
**Action:** Always verify nested Radix components with visual tests and follow the proven nesting hierarchy to avoid interaction conflicts.
