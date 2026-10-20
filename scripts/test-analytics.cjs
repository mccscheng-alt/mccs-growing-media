const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');

const plan = JSON.parse(fs.readFileSync('docs/analytics-measurement-plan.json', 'utf8'));
const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const existingUntagged = new Set([
  'cn/use-guide/index.html', 'guides/index.html', 'insights/how-to-choose-substrate-plug/index.html'
]);
let trackedPages = 0;
for (const file of files.filter((name) => name.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  const loaders = [...html.matchAll(/googletagmanager\.com\/gtag\/js\?id=(G-[A-Z0-9]+)/g)];
  if (!loaders.length) {
    assert.ok(existingUntagged.has(file), `${file}: Google tag unexpectedly missing.`);
    continue;
  }
  trackedPages += 1;
  assert.equal(loaders.length, 1, `${file}: use one Google tag loader.`);
  assert.equal(loaders[0][1], plan.measurement_id, `${file}: stale measurement ID.`);
  const configs = [...html.matchAll(/gtag\(\s*['"]config['"]\s*,\s*['"](G-[A-Z0-9]+)['"]/g)];
  assert.equal(configs.length, 1, `${file}: use one config and automatic page view.`);
  assert.equal(configs[0][1], plan.measurement_id, `${file}: stale config ID.`);
  if (!['admin.html', 'privacy.html', 'terms.html'].includes(file)) {
    assert.ok(html.indexOf('id="mccs-consent-default"') >= 0, `${file}: consent default missing.`);
    assert.ok(html.indexOf('id="mccs-consent-default"') < loaders[0].index,
      `${file}: default consent must precede the Google tag.`);
  }
}
assert.ok(trackedPages > 0, 'The migration must retain the existing tracked pages.');
for (const file of ['scripts/generate-cn-site.mjs', 'scripts/generate-seo-authority-pages.mjs',
  'scripts/sync-localized-trust-pages.mjs', 'scripts/sync-consent-mode.mjs']) {
  const source = fs.readFileSync(file, 'utf8');
  const ids = source.match(/G-[A-Z0-9]{10}/g) || [];
  assert.ok(ids.length, `${file}: keep the tracking template.`);
  assert.ok(ids.every((id) => id === plan.measurement_id), `${file}: generation would restore a stale ID.`);
}

const source = fs.readFileSync('assets/mobile-ux.js', 'utf8');
function harness({ lang = 'en', pathname = '/products/', tracking = 'enabled' } = {}) {
  const events = [];
  const handlers = {};
  const origin = 'https://www.mccsgrowingmedia.com';
  const window = { location: { origin, pathname, search: '' } };
  if (tracking !== 'absent') window.gtag = (...args) => {
    if (tracking === 'throws') throw new Error('Analytics blocked');
    events.push(args);
  };
  const storage = { getItem() { return null; }, setItem() {}, removeItem() {} };
  vm.runInNewContext(source, {
    window, URL, URLSearchParams, localStorage: storage, sessionStorage: storage,
    navigator: { language: lang, languages: [lang] },
    document: {
      readyState: 'complete', documentElement: { lang },
      getElementById() { return null; }, querySelector() { return null; },
      querySelectorAll() { return []; },
      addEventListener(name, callback) { handlers[name] = callback; }
    },
    fetch: async () => ({ ok: true, json: async () => ({}) }), setTimeout
  });
  return {
    events,
    click(href, position = 'content', prevented = false) {
      const link = {
        href: new URL(href, origin + pathname).href,
        getAttribute() { return href; },
        closest(selector) {
          return (selector === '.site-header' && position === 'header')
            || (selector === '.site-footer' && position === 'footer') ? {} : null;
        },
        classList: { contains(value) { return value === 'whatsapp-float' && position === 'floating'; } }
      };
      handlers.click({ defaultPrevented: prevented, target: { closest() { return link; } } });
    }
  };
}

for (const [lang, prefix] of [['en', ''], ['es', '/es'], ['ar', '/ar'], ['zh-CN', '/cn']]) {
  const test = harness({ lang, pathname: `${prefix}/products/` });
  assert.equal(test.events.length, 0, 'Do not generate an extra manual page view.');
  test.click(`${prefix}/contact/#quoteForm`, 'header');
  assert.equal(test.events.length, 1);
  assert.equal(test.events[0][1], 'contact_cta_click');
  assert.equal(test.events[0][2].site_language, lang.toLowerCase());
  assert.equal(test.events[0][2].content_group, 'products');
  assert.equal(test.events[0][2].link_location, 'header');
}
for (const [path, group] of [['/', 'home'], ['/index.html', 'home'], ['/cn/index.html', 'home'], ['/cn/sample-shipping/', 'sample_shipping'],
  ['/ar/private-label/', 'private_label'], ['/insights/article/', 'insights'], ['/other/', 'other']]) {
  const test = harness({ pathname: path });
  test.click('mailto:private@example.com?subject=Buyer&body=Secret', 'footer');
  assert.equal(test.events[0][1], 'email_click');
  assert.equal(test.events[0][2].content_group, group);
  assert.equal(test.events[0][2].link_location, 'footer');
  assert.ok(!JSON.stringify(test.events).includes('private@example.com'));
  assert.ok(!JSON.stringify(test.events).includes('Secret'));
}
const interactions = harness();
interactions.click('tel:+15551234567');
assert.equal(interactions.events[0][1], 'phone_click');
assert.ok(!JSON.stringify(interactions.events).includes('15551234567'));
interactions.click('/docs/specs.xlsx?email=private@example.com#Secret');
assert.equal(interactions.events[1][1], 'resource_download');
assert.equal(interactions.events[1][2].link_url, 'https://www.mccsgrowingmedia.com/docs/specs.xlsx');
assert.equal(interactions.events[1][2].file_extension, 'xlsx');
interactions.click('https://wa.me/15551234567');
interactions.click('https://other.example/contact/');
interactions.click('https://other.example/specs.pdf');
interactions.click('/products/');
interactions.click('/contactindex.html');
interactions.click('/contact/', 'content', true);
assert.equal(interactions.events.length, 2, 'Do not duplicate WhatsApp, generic clicks or canceled navigation.');
for (const tracking of ['absent', 'throws']) {
  const test = harness({ tracking });
  for (const href of ['/contact/', 'mailto:sales@example.com', 'tel:+15551234567', '/docs/specs.pdf']) {
    assert.doesNotThrow(() => test.click(href), 'Navigation must work without analytics.');
  }
}
assert.deepEqual(plan.events.filter((event) => event.key_event).map((event) => event.name), ['generate_lead']);
assert.equal(plan.default_lead_value, null, 'Do not invent monetary values for inquiries.');
console.log(`Analytics checks passed: ${trackedPages} tagged HTML pages, generator IDs, four languages, safe click payloads and no duplicate WhatsApp/page views.`);
