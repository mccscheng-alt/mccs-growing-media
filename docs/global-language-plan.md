# Global B2B language rollout

## Current release

English is the global default. The strawberry record is available as reviewed
English, Simplified Chinese, Spanish and Arabic pages after this PR is merged
and its production deployment is verified. Every article has a self canonical,
reciprocal language links and an English x-default. Arabic uses RTL layout.
Do not redirect visitors automatically by IP or browser language. The shared
header provides a native, keyboard-accessible language select built from the
page's existing language links. Without JavaScript the links remain usable.

## Optional on-demand translation

An integrated translation service may provide reading convenience for languages
without an editorial edition. It is not implemented or enabled in this release:
provider choice, API credentials, usage limits and any paid subscription require
separate setup. Do not add a nonfunctional global-language menu or expose an API
secret in client JavaScript. An implementation must distinguish reviewed copy
from automatic translation, protect product codes and units, cache translations,
apply cost limits, preserve contact destinations and leave canonical/indexed
content in its reviewed source language. Never imply machine output is a reviewed
customer result. Do not send form entries or customer contact data for translation.

## Market candidates, not confirmed demand

| Buyer market | Candidate language | URL convention | Validation needed |
| --- | --- | --- | --- |
| South Korea | Korean, `ko` | `/ko/` | Existing anonymous grower feedback; confirm buyer terminology and inquiry needs |
| Turkey | Turkish, `tr` | `/tr/` | Current prospects, demand and local horticulture wording |
| Japan | Japanese, `ja` | `/ja/` | Technical terminology, product questions and business-language review |
| Uzbekistan | Uzbek Latin, `uz` | `/uz/` | Ask actual buyers whether they prefer Uzbek, Russian or English |
| Russian-speaking buyers | Russian, `ru` | `/ru/` | Buyer preference; do not equate Russian with all Uzbekistan visitors |

These are proposed routes, not existing published pages. French, Portuguese
and German remain candidates if qualified traffic and sales activity justify them.
No market-size or search-volume estimates are assumed.

## Release a useful purchase path

For each selected language, translate the homepage, product catalogue, sample
and shipping page, contact page and the most relevant evidence article together.
Preserve approved models, dimensions, MOQ and carton counts. Do not promise
local stock, guaranteed rooting times, local certifications or native-language
sales support without confirmation. Never expose customer identity in a case.

Translate navigation, image alt text, metadata and inquiry labels as well as body
copy. Keep unique URLs, self canonicals, reciprocal hreflang and sitemap entries.
Do not advertise routes before the destination pages are ready. A browser's
translation feature is supplementary convenience, not an indexed local edition.

## Prioritization and measurement

Prioritize current qualified customers and active sales markets, then examine
GA4 country/language reports, Search Console queries and actual qualified
inquiries. A country is not proof of a preferred language; a click is not a lead.
Evaluate qualified inquiry and sample-trial progression, not translation count.

## Reference

- https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- https://developers.google.com/search/docs/specialty/international/localized-versions
