## 2025-07-24 - [Tooltip Timing and Provider]
**Learning:** Tooltips in Radix/Shadcn require a slight delay to animate in during automated testing. Also, the `TooltipProvider` must be at the root of the app to enable tooltips throughout.
**Action:** Always wrap the root layout with `TooltipProvider` and add a 2-second delay in Playwright scripts when verifying tooltips.
