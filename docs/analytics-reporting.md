# MCCS GA4 measurement and release checklist

## Scope

Use `G-GLM9JS10QN` consistently in existing HTML pages and source generators.
`analytics-measurement-plan.json` documents the events and reporting contract.
The package changes tracking, not product facts, the Formspree endpoint, hosting,
cookie choices, consent defaults or buyer-facing copy. Legal and admin HTML only
receive the previously authorized measurement-ID replacement.
The 99 already-tagged HTML pages are migrated. Two existing redirect pages and
the separate Chinese use-guide page remain untagged; no new tracking is inserted
there by this release.

## Inquiry funnel

| Step | Event or report | Interpretation |
| --- | --- | --- |
| Acquisition | Session source / medium, landing page, country, device | Where measured visits originate |
| Contact-page navigation | `contact_cta_click` | Click toward contact, not a submitted inquiry |
| Form interaction | Enhanced `form_start` and `form_submit` | Interaction and submit attempt, not endpoint acceptance |
| Accepted inquiry | `generate_lead` | A successful form-endpoint response, not lead qualification or an order |
| Contact alternatives | `email_click`, `phone_click`, `whatsapp_click` | Intent only; sending, calling and conversation are unconfirmed |
| Documents | `resource_download` | Same-origin PDF/XLSX/CSV link click, not completed transfer |

Keep `generate_lead` as the primary inquiry key event. Do not invent an inquiry
value or send `purchase`, `qualify_lead` or `close_convert_lead` without a verified
business outcome. Existing unused GA4 key-event definitions need not be deleted.

Do not add together `click` and its derived `whatsapp_click`, `file_download` and
`resource_download`, or `form_submit` and `generate_lead`. They overlap or measure
different stages. The site deliberately does not emit a second `whatsapp_click`
or manual `page_view`; the existing GA4 derived rule remains the WhatsApp source.

## Parameters and privacy

- `site_language`: page language, normalized to `en`, `es`, `ar` or `zh-cn` for
  the existing locales. This is not the visitor's browser language.
- `link_location`: `header`, `footer`, `content` or `floating`.
- `content_group`: bounded page-section name, attached to the custom buyer
  interaction events. It is not added retroactively to automatic page views.
- Form events retain `form_id`, `form_language` and `lead_type`; the old fallback
  additionally retains its existing `form_name` and `language` for compatibility.
- New click-event payloads do not include email addresses, phone numbers, form
  fields, free text, link labels or verification tokens. The existing custom
  document-click URL now excludes query strings and fragments.
- This is not global URL redaction: GA4 enhanced measurement can send its own
  URL/link parameters. Never place customer contact details in URLs or UTMs.
- A blocked or throwing analytics function must not interrupt navigation or show
  an accepted inquiry as a submission failure.

Create event-scoped custom dimensions `Site language` (`site_language`) and
`Link location` (`link_location`) once per property. Do not duplicate the built-in
Content group dimension. The dimensions only become useful after deployed code
sends parameters; standard reporting may require 24-48 hours after collection.

## Campaign naming

Use a shared campaign such as `root_evidence_202610` and lowercase sources
`instagram`, `facebook`, `linkedin`, `reddit`, `xiaohongshu`, `whatsapp` and
`zoho`. Use `social` for organic social links and `email` for email outreach.
Include a stable non-personal `utm_content`, such as `profile` or `root_photo`.
Only use tagged links when the destination and platform rules permit them.

For example:

```text
https://www.mccsgrowingmedia.com/products/?utm_source=instagram&utm_medium=social&utm_campaign=root_evidence_202610&utm_content=profile
```

Do not put UTMs on internal navigation, add recipient names/emails, relabel paid
traffic as organic, or publish/change any social profile as part of this code PR.

## Release and acceptance

1. Start from the latest `main`; use a `codex/` branch and a reviewed PR. The owner
   merges. Do not auto-merge, push directly to `main` or deploy a local folder
   directly to production to bypass this workflow.
2. Run the focused checks below and inspect the protected-file diff. No new npm
   dependencies or build pipeline are needed for this static website.
3. Confirm the existing Vercel project's Domains and linked repository before
   changing a Git connection. Preserve the working domain, DNS and deployment.
4. In the preview, inspect one Google tag loader and one config using the new
   measurement ID, and confirm the default consent appears before the loader.
   Do not mark preview/test traffic as actual buyer performance.
5. After merge/deployment, verify the production tag and GA4 Realtime. Test one
   contact navigation, one email/phone click and one document click per relevant
   locale. Verify that WhatsApp is derived once, not emitted twice by site code.
6. The owner completes one clearly labeled test inquiry and checks Formspree or
   the receiving mailbox. A click, an automated form submit or a mocked unit
   response is not proof of real inquiry delivery. Record the test separately.
7. Configure any active internal-traffic filter only after testing it; do not
   silently drop production data. Do not change retention, access, Ads links or
   reporting identity as part of this release.

```powershell
node scripts/test-analytics.cjs
node scripts/test-form-protection.cjs
node scripts/test-root-evidence-generators.cjs
node scripts/test-factory-demonstrations.cjs
node scripts/audit-json-ld.mjs --strict
python scripts/audit-site.py
git diff --check
```

Turnstile remains inactive unless the existing public key and Formspree server
integration are separately configured. This release must not claim CAPTCHA or
delivery verification. The analytics tests use mocks and never send inquiries to
the production endpoint.

## Reporting after collection starts

Review weekly: sessions by source/medium; landing pages; country and device;
contact-link clicks; accepted form inquiries; and document interest. Use
session-scoped key-event rates where available rather than dividing arbitrary
event totals by users. A missing or suppressed report value is unknown, not zero.

Record the production cutover time. Keep old-property exports separate with
property ID, date range, timezone, metric scope and source attached. This code
package does not recover inaccessible reports or import old users/sessions into
the new property. Do not add distinct users or sessions across properties as if
they were deduplicated. Vercel CDN requests are operational traffic, not visitors.

## Primary references

- [Recommended generate_lead event](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#generate_lead)
- [Avoid duplicate page views](https://developers.google.com/analytics/devguides/collection/ga4/views)
- [Enhanced measurement](https://support.google.com/analytics/answer/9216061)
- [Event-scoped custom dimensions](https://support.google.com/analytics/answer/14239696)
- [Campaign tagging](https://support.google.com/analytics/answer/11242870)
- [Vercel CDN usage](https://vercel.com/docs/manage-cdn-usage)
