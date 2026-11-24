# MCCS Full-Site Optimization Report

**Date:** 2026-11-24  
**Branch:** `codex/full-site-optimization-2026-11-24`  
**Scope:** Safe buyer-facing SEO, conversion, structured-data, sitemap, accessibility and performance improvements. Existing local changes to `contact/index.html`, `scripts/generate-sitemap.mjs` and `sitemap.xml` were preserved and included.

## Completed

- Added conservative buyer CTA and FAQ improvements across English application, product, insights, partner and evidence pages; no product specifications or unsupported claims were introduced.
- Preserved and validated the contact conversion form, including the existing Formspree endpoint, optional WhatsApp field, accessible labels/ARIA, application choices and sample CTA.
- Preserved homepage/product/catalog CTA and application filter work already present; product catalog remains driven by existing `data/products.json`.
- Preserved structured data and validated catalog JSON-LD: 112 model entities across four catalog pages, with no JSON-LD parse errors or invalid entities.
- Preserved local image alt text and intrinsic dimensions/loading attributes; final audit found 298 images, 0 missing alt attributes and 0 local-image dimension gaps.
- Updated sitemap generation to skip protected/non-buyer paths and noindex pages; regenerated sitemap with 83 indexable buyer URLs.
- Added/retained language alternates where safe. Noindex legacy redirects intentionally remain without hreflang.
- Protected files and integrations were not edited: `data/products.json`, `admin.html`, `privacy.html`, `terms.html`, Vercel configuration, Formspree endpoint and GA ID.

## Validation Results

- `python scripts/audit-site.py` — **PASS**: 103 HTML pages; 83 sitemap URLs; 112 catalog model entities; 0 errors; 0 warnings.
- `node scripts/audit-json-ld.mjs --strict` — **PASS**: 0 parse errors; 0 invalid catalog entities; 0 invalid list items.
- `node scripts/generate-sitemap.mjs` — **PASS**: generated 83 indexable buyer pages.
- `node scripts/test-form-protection.cjs` — **PASS**: form validation, Turnstile lifecycle, token retry, lead tracking and protected endpoints. (Test notes that a real public Turnstile key is still required before rollout.)
- `node scripts/test-analytics.cjs` — **PASS**: 103 tagged HTML pages and no duplicate WhatsApp/page-view signals.
- `node scripts/test-root-evidence-generators.cjs` — **PASS**.
- `git diff --check` — whitespace warnings were limited to pre-existing/generated line-ending behavior; accidental legacy-route whitespace was restored.
- `node scripts/test-factory-demonstrations.cjs` — existing generator idempotence assertion failed in the repository fixture; no factory-demonstration source files were modified in this optimization pass.

## Protected Scope Review

- Product data, model names, dimensions, MOQ and carton data: unchanged.
- Formspree endpoint: unchanged.
- Google Analytics ID `G-GLM9JS10QN`: unchanged.
- Vercel config, legal pages and admin page: unchanged.
- No remote branch, GitHub PR or merge was created.

## Changed Files

See `git diff --name-only` on the branch for the complete list. The main groups are:

- Buyer-facing HTML: application, product, insights, partner, evidence, contact and Chinese use-guide pages.
- `scripts/generate-sitemap.mjs`
- `sitemap.xml`
- This report.

## Follow-up Before PR Merge

- Review the generated buyer-facing FAQ/CTA additions visually in local preview.
- Investigate the pre-existing factory-demonstration generator idempotence failure before relying on that test as a merge gate.
- Run Lighthouse or deployment smoke tests in CI/preview; this environment did not publish or access GitHub remotely.
