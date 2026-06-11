# Branch Strategy Guide

This document describes the branches that actually exist in the Angular Shopping Cart Workshop repository and what each one is for. All branches run **Angular 22 + TypeScript 6** and use **pnpm** (`pnpm install` after every branch switch!).

## 🌿 The Two Primary Branches

```
workshop-starter   (exercises with TODOs — participants work here)
workshop-complete  (full solutions with educational comments)
```

| Branch | Purpose | Audience |
|--------|---------|----------|
| `workshop-starter` | Educational skeleton: TODO/HINT/LEARNING comments, methods throw until implemented | Workshop participants |
| `workshop-complete` | Reference solutions for every module | Self-learners & instructors |

**Typical participant flow:**
```bash
git switch workshop-starter
pnpm install
pnpm start
# ...work through the docs/ modules...

# stuck? peek at a solution:
git stash && git switch workshop-complete && pnpm install
```

## 🌱 Topic Branches

Some modules have dedicated branches with extra scaffolding or alternative content:

| Branch | Use with | Notes |
|--------|----------|-------|
| `workshop-starter-inject` | `docs/INJECT.md` | Adds the `config/`, `providers/` and `utils/` folders the inject() tasks need |
| `workshop-starter-control-flow` | `docs/CONTROL_FLOW.md` | Templates intentionally keep `*ngIf`/`*ngFor`/`*ngSwitch` — converting them IS the exercise |
| `workshop-compelete-form` | `docs/SIGNAL_FORMS.md` | Completed Signal Forms module (note: branch name contains a historical typo — "compelete") |
| `workshop-complete-signal-store` | basic/signal-store module | workshop-complete plus an extended @ngrx/signals store example |
| `webinar` | webinar sessions | Mirror of `workshop-starter` (kept in sync by fast-forward) |
| `main` | archive | The original workshop baseline, upgraded to Angular 22; not used during sessions |

## 🔄 Keeping Branches Consistent

When you change shared content (docs, shared models, app shell):

```bash
# 1. Commit on workshop-starter
git switch workshop-starter
# ...commit...

# 2. Cherry-pick docs/shared fixes to workshop-complete
git switch workshop-complete
git cherry-pick <commit>

# 3. Fast-forward webinar to workshop-starter
git branch -f webinar workshop-starter
```

Solutions only ever change on `workshop-complete` (and its variants); exercises only on the starter branches.

## ✅ Branch Hygiene Checklist

Before a workshop session:

- [ ] `pnpm run build` passes on the branch you will use
- [ ] `pnpm exec ng test --watch=false --browsers=ChromeHeadless` passes
- [ ] The docs module you will teach matches the branch (see table above)
- [ ] Node 22.22+/24+ active (`nvm use 24`) — Angular CLI 22 requirement
