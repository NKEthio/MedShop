## 2026-07-15 - Focused UX Improvements and Line Limits

**Learning:** Combining multiple UX improvements (e.g., tooltips + currency formatting) quickly exceeds the strict 50-line diff limit when including necessary imports and structural wrappers (like `TooltipProvider`). High-impact global elements like navigation tooltips should be prioritized and isolated in PRs to ensure clarity and adherence to repository constraints.

**Action:** Isolate micro-UX wins into single-feature PRs and rigorously verify the staged diff size using `git diff --staged | grep '^[+-]' | grep -v '^[+-][+-]' | wc -l` before submission.
