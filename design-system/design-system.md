# Forex & Copy-Trading Design System (Figma Sync Guide)

This document provides the exact specifications for the Figma designer to build out the 1440px component library and layout system in sync with the React Tailwind implementation.

## 1. Global Theme Specifications

**Base Width:** `1440px` (Desktop-First)
**Responsive Breakpoints:** `992px` (Tablet / Collapsed Sidebar), `640px` (Mobile / Stacked Rail)
**Mood:** Dark Premium / High-Density Data / Institutional Retail

## 2. Color Tokens (Figma Variables)

Create a Local Variable Collection named **"Theme"** with two modes: `Dark` and `Light`.

### Surface & Background

- **Surface/Base:** Dark `#0B0E10` | Light `#F5F8FA`
- **Surface/Default (Cards):** Dark `#12171A` | Light `#FFFFFF`
- **Surface/Elevated (Hover/Modals):** Dark `#181D21` | Light `#F9FBFC`

### Brand & Accents

- **Brand/Primary (Neon Lime):** Dark `#39FF14` | Light `#27C900`
- **Brand/Hover:** Dark `#32E612` | Light `#22AA00`
- **Brand/Muted (10% opacity):** Dark `rgba(57, 255, 20, 0.1)` | Light `rgba(39, 201, 0, 0.1)`

### Typography (Text Colors)

- **Text/Primary (High-Contrast):** Dark `#FFFFFF` | Light `#0B0E10`
- **Text/Secondary (Default):** Dark `#A1B0B8` | Light `#5C6A72`
- **Text/Muted (Labels):** Dark `#6E7C82` | Light `#8A9AA3`
- **Text/On-Brand (Inverse):** Dark `#000000` | Light `#FFFFFF`

### Semantic Feedback (Orders & Charts)

- **System/Positive (Up/Buy):** Use `Brand/Primary`
- **System/Negative (Down/Sell):** Dark & Light `#FF4560` (Vibrant Matte Red)
- **System/Warning (Margin Call):** Dark & Light `#FFB800`

## 3. Typography Scale (Figma Text Styles)

Use **Space Grotesk** for Displays/Balances. Use **Inter** for all UI, Tables, and Data.

- **Display/H1:** Space Grotesk `32px`, Bold (700), `-2% Tracking`, `1.2 LH`
- **Heading/H2:** Inter `24px`, SemiBold (600), `-1% Tracking`, `1.3 LH`
- **Subheading/H3:** Inter `18px`, SemiBold (600), `0% Tracking`, `1.4 LH`
- **Body/Large:** Inter `16px`, Regular (400), `1.5 LH`
- **Body/Default:** Inter `14px`, Regular (400), `1.5 LH`
- **Body/Small (Data Tables):** Inter `12px`, Medium (500), `1% Tracking`, `1.5 LH`
- **Caption/Micro:** Inter `11px`, SemiBold (600), `4% Tracking` (Uppercase), `1.4 LH`

## 4. Spacing, Grids & Radii

- **Grid:** 1440px container, 24px margins, 24px row/column gaps.
  - Sidebar: Fixed `240px` (collapsed: `64px`)
  - Center Feed: `1fr`
  - Right Rail: Fixed `380px`
- **Spacing Scale:** `4px`, `8px`, `16px`, `24px`, `32px`
- **Radii:**
  - Data Tags / Pills: `6px`
  - Standard Cards / Buttons / Inputs: `12px`
  - Large Panels / Modals: `20px`

## 5. Component Variants (Figma Naming Structure)

### Button

- **Properties:** `Variant` (Primary, Secondary, Ghost), `Size` (sm, md, lg), `State` (Default, Hover, Disabled, Loading)
- _Note:_ Primary buttons use Brand background with `Text/On-Brand` foreground.

### Input/Select

- **Properties:** `State` (Default, Focus, Error, Disabled), `Icon` (Left, Right, None)
- _Note:_ Active border should glow with `Brand/Muted` shadow.

### ProviderCard (Copy-Trading)

- **Properties:** `FollowStatus` (Following, Not Following), `Rank` (Top 3, Standard)
- _Note:_ Must feature a mini Sparkline right-aligned.

## 6. Accessibility & Motion Rules

- All `Text/Secondary` against `Surface/Default` must hit WCAG AA (4.5:1).
- Hover states include a `200ms ease-out` transition.
- Ghost button borders should increment from `rgba(255,255,255,0.06)` to `rgba(255,255,255,0.3)` on hover.

_(Deliverable 1/6: Design System Blueprint Complete)_
