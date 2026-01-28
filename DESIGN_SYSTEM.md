# Design System Documentation

## Overview

This Design System is built to ensure consistency, scalability, and efficiency across the application. It uses **Tailwind CSS v4** with CSS variables defined in `@theme` blocks, following an **Atomic Design** methodology.

### Key Principles

1.  **Token-Driven**: All styles (colors, spacing, typography) should rely on defined CSS tokens, not magic numbers.
2.  **Atomic Structure**: Components are organized into Atoms, Molecules, and Organisms.
3.  **Semantic Naming**: Tokens describe _purpose_ (e.g., `brand`, `success`, `surface`), not just value.

---

## 1. Design Tokens

The core visual language is defined in `src/app/globals.css`.

### Colors

We use a semantic color scale. References to specific hex codes should be avoided in components.

| Token         | Usage                         | Utilities                                         |
| :------------ | :---------------------------- | :------------------------------------------------ |
| **Brand**     | Primary actions, branding     | `text-brand`, `bg-brand`, `border-brand`          |
| **Brand Alt** | Secondary brand touches       | `text-brand-alt`                                  |
| **Success**   | Positive actions (teal/green) | `text-brand-success`, `bg-brand-success`          |
| **Surface**   | Card backgrounds, modals      | `bg-surface`, `bg-surface-secondary`              |
| **Text**      | Main content                  | `text-txt-main`, `text-txt-sec`, `text-txt-muted` |
| **States**    | Interactive feedback          | `hover:bg-surface-hover`                          |

**Functional Colors:**

- `--color-success` / `text-success`
- `--color-warning` / `text-warning`
- `--color-error` / `text-error`
- `--color-info` / `text-info`

### Typography

Typography is standardized using semantic sizing and distinct font families: `Sora` (Headings) and `Inter` (Body).

| Level     | Size Token (px) | Utility Class | Font  |
| :-------- | :-------------- | :------------ | :---- |
| **H1**    | 36px            | `text-h1`     | Sora  |
| **H2**    | 28px            | `text-h2`     | Sora  |
| **H3**    | 20px            | `text-h3`     | Sora  |
| **H4**    | 18px            | `text-h4`     | Sora  |
| **Body**  | 16px            | `text-p`      | Inter |
| **Small** | 14px            | `text-sm`     | Inter |
| **Tiny**  | 12px            | `text-tiny`   | Inter |
| **Micro** | 10px            | `text-micro`  | Inter |

**Usage**: Use the `<Typography />` atom for consistent text rendering.

### Spacing & Layout

Consistency in whitespace is critical.

| Token | Size (px) |
| :---- | :-------- |
| `xxs` | 4px       |
| `xs`  | 8px       |
| `sm`  | 12px      |
| `md`  | 16px      |
| `lg`  | 24px      |
| `xl`  | 32px      |
| `xxl` | 48px      |
| `xll` | 64px      |

### Radius & Shadows

- **Radius**: `rounded-card` (16px), `rounded-pill` (12px), `rounded-sm` (8px).
- **Shadows**: `shadow-soft`, `shadow-lg`, `shadow-xl`.

---

## 2. Component Architecture

### Atoms (`src/components/atoms`)

The smallest building blocks. These should have **no external dependencies** (aside from utils) and handle their own local state only if necessary.

- **Examples**: `Button`, `Input`, `Typography`, `Badge`, `Logo`.
- **Rule**: Atoms must strictly adhere to design tokens.

### Molecules (`src/components/molecules`)

Combinations of atoms functioning as a unit.

- **Examples**: `Card` (Image + Text + Button), `NotificationBadge` (Icon + Badge).
- **Rule**: Focus on layout and composition of atoms.

### Organisms (`src/components/organisms`)

Complex sections of the interface, potentially connecting to business logic.

- **Examples**: `Navbar`, `FormHeader`, `NotificationBell`.
- **Rule**: Can contain business logic or complex state management.

---

## 3. Best Practices & Validation

### ✅ Do

- Use `bg-surface` and `text-txt-main` for standard containers.
- Use the `<Typography />` component for all text to ensure responsive consistency.
- Use `rounded-card` for all container elements.
- Use the defined shadow utilities (`shadow-soft`) instead of custom shadow values.

### ❌ Don't

- Hardcode hex values (e.g., `#0099ff`). **Always** use `text-brand` or equivalent.
- Mix font families manually. Let the utility classes handle it (`text-h1` applies Sora automatically).
- Use arbitrary spacing (e.g., `m-[13px]`) unless absolutely necessary for pixel-perfect alignment in edge cases.

### Validation Review (Jan 2026)

- **Status**: Healthy ✅
- **Observations**:
  - Global styles are well-structured in `globals.css` using Tailwind v4.
  - Key atoms (`Button`, `Input`) correctly leverage the token system.
  - Minor inconsistency found in `Input` error border (`border-red-500` should be `border-error`), but overall compliance is high.
