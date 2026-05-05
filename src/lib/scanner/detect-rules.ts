import * as cheerio from 'cheerio';

export interface ScanResult {
  key: string;
  label: string;
  status: 'PASS' | 'WARNING' | 'FAIL' | 'MANUAL_REVIEW';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: string;
  detectedValue?: string;
}

export function detectPrivacyIssues(html: string): ScanResult[] {
  const $ = cheerio.load(html);
  const results: ScanResult[] = [];
  const bodyText = $('body').text().toLowerCase();
  const fullHtml = html.toLowerCase();

  const privacyLink = $('a').filter((_, el) => {
    const text = $(el).text().toLowerCase();
    const href = $(el).attr('href') || '';
    return text.includes('privacy') || href.includes('privacy');
  }).length > 0;

  results.push({
    key: 'privacy_policy_link',
    label: 'Privacy Policy Link',
    status: privacyLink ? 'PASS' : 'FAIL',
    severity: privacyLink ? 'LOW' : 'CRITICAL',
    details: privacyLink ? 'Privacy policy link found on page.' : 'No privacy policy link detected. This is required under GDPR.',
  });

  const cookieLink = $('a').filter((_, el) => {
    const text = $(el).text().toLowerCase();
    const href = $(el).attr('href') || '';
    return text.includes('cookie') || href.includes('cookie');
  }).length > 0;

  results.push({
    key: 'cookie_policy_link',
    label: 'Cookie Policy Link',
    status: cookieLink ? 'PASS' : 'WARNING',
    severity: cookieLink ? 'LOW' : 'HIGH',
    details: cookieLink ? 'Cookie policy link found.' : 'No cookie policy link detected.',
  });

  const termsLink = $('a').filter((_, el) => {
    const text = $(el).text().toLowerCase();
    const href = $(el).attr('href') || '';
    return text.includes('terms') || href.includes('terms') || text.includes('tos');
  }).length > 0;

  results.push({
    key: 'terms_link',
    label: 'Terms of Service Link',
    status: termsLink ? 'PASS' : 'WARNING',
    severity: termsLink ? 'LOW' : 'MEDIUM',
    details: termsLink ? 'Terms of service link found.' : 'No terms of service link detected.',
  });

  const consentBanner =
    (bodyText.includes('cookie') && (bodyText.includes('accept') || bodyText.includes('consent') || bodyText.includes('agree'))) ||
    fullHtml.includes('cookiebot') ||
    fullHtml.includes('onetrust') ||
    fullHtml.includes('cookiepro') ||
    fullHtml.includes('usercentrics') ||
    fullHtml.includes('termly') ||
    fullHtml.includes('cookie-banner') ||
    fullHtml.includes('cookie-consent') ||
    fullHtml.includes('gdpr-cookie');

  results.push({
    key: 'consent_banner',
    label: 'Cookie Consent Banner',
    status: consentBanner ? 'PASS' : 'FAIL',
    severity: consentBanner ? 'LOW' : 'HIGH',
    details: consentBanner ? 'Cookie consent banner or CMP detected.' : 'No cookie consent banner detected. Required if using analytics or marketing cookies.',
  });

  const ga4 = fullHtml.includes('gtag') || fullHtml.includes('google-analytics') || fullHtml.includes('ga4') || fullHtml.includes('googletagmanager');
  if (ga4) {
    results.push({
      key: 'analytics_ga4',
      label: 'Google Analytics / GTM Detected',
      status: 'WARNING',
      severity: 'MEDIUM',
      details: 'Google Analytics or Google Tag Manager detected. Ensure consent is collected before loading.',
      detectedValue: 'Google Analytics/GTM',
    });
  }

  const plausible = fullHtml.includes('plausible.io') || fullHtml.includes('cdn.fathom');
  if (plausible) {
    results.push({
      key: 'analytics_privacy_friendly',
      label: 'Privacy-Friendly Analytics Detected',
      status: 'PASS',
      severity: 'LOW',
      details: 'Privacy-friendly analytics (Plausible/Fathom) detected.',
      detectedValue: 'Plausible/Fathom',
    });
  }

  const metaPixel = fullHtml.includes('connect.facebook.net') || fullHtml.includes('facebook.net/en_us/fbevents') || fullHtml.includes('fbq(');
  if (metaPixel) {
    results.push({
      key: 'tracker_meta_pixel',
      label: 'Meta (Facebook) Pixel Detected',
      status: 'WARNING',
      severity: 'HIGH',
      details: 'Meta Pixel detected. Requires explicit consent under GDPR.',
      detectedValue: 'Meta Pixel',
    });
  }

  const linkedinInsight = fullHtml.includes('snap.licdn.com') || fullHtml.includes('linkedin.com/insight');
  if (linkedinInsight) {
    results.push({
      key: 'tracker_linkedin',
      label: 'LinkedIn Insight Tag Detected',
      status: 'WARNING',
      severity: 'HIGH',
      details: 'LinkedIn Insight Tag detected. Requires consent.',
      detectedValue: 'LinkedIn Insight',
    });
  }

  const tiktok = fullHtml.includes('analytics.tiktok.com');
  if (tiktok) {
    results.push({
      key: 'tracker_tiktok',
      label: 'TikTok Pixel Detected',
      status: 'WARNING',
      severity: 'HIGH',
      details: 'TikTok Pixel detected. Requires consent.',
      detectedValue: 'TikTok Pixel',
    });
  }

  const forms = $('form').length > 0;
  const emailInputs = $('input[type="email"]').length > 0;
  if (forms || emailInputs) {
    results.push({
      key: 'forms_personal_data',
      label: 'Forms Collecting Personal Data',
      status: 'WARNING',
      severity: 'MEDIUM',
      details: 'Forms detected (' + $('form').length + ' form(s), ' + $('input[type="email"]').length + ' email input(s)). Ensure forms include privacy notices and consent where required.',
    });
  }

  const stripe = fullHtml.includes('js.stripe.com') || fullHtml.includes('stripe.com');
  const paypal = fullHtml.includes('paypal.com') || fullHtml.includes('paypalobjects.com');
  if (stripe || paypal) {
    const detected = [stripe && 'Stripe', paypal && 'PayPal'].filter(Boolean).join(', ');
    results.push({
      key: 'payment_providers',
      label: 'Payment Processor Detected',
      status: 'MANUAL_REVIEW',
      severity: 'MEDIUM',
      details: 'Payment processor detected (' + detected + '). Document as a data processor.',
      detectedValue: detected,
    });
  }

  const youtube = fullHtml.includes('youtube.com/embed') || fullHtml.includes('youtube-nocookie.com');
  const calendly = fullHtml.includes('calendly.com');
  const typeform = fullHtml.includes('typeform.com');
  const hubspot = fullHtml.includes('hs-scripts.com') || fullHtml.includes('hubspot.com');
  const intercom = fullHtml.includes('intercom') || fullHtml.includes('intercomcdn');

  const embeds = [
    youtube && 'YouTube',
    calendly && 'Calendly',
    typeform && 'Typeform',
    hubspot && 'HubSpot',
    intercom && 'Intercom',
  ].filter(Boolean);

  if (embeds.length > 0) {
    results.push({
      key: 'third_party_embeds',
      label: 'Third-Party Embeds/Widgets Detected',
      status: 'WARNING',
      severity: 'MEDIUM',
      details: 'Third-party services detected: ' + embeds.join(', ') + '. These may transfer data to external processors.',
      detectedValue: embeds.join(', '),
    });
  }

  return results;
}

export function calculateScore(findings: ScanResult[]): number {
  if (findings.length === 0) return 0;

  const weights: Record<string, number> = {
    privacy_policy_link: 25,
    consent_banner: 20,
    cookie_policy_link: 15,
    terms_link: 10,
  };

  let earned = 0;
  const total = 70;

  for (const finding of findings) {
    const weight = weights[finding.key];
    if (weight) {
      if (finding.status === 'PASS') earned += weight;
      else if (finding.status === 'WARNING') earned += weight * 0.5;
    }
  }

  const hasConsentBanner = findings.find((f) => f.key === 'consent_banner' && f.status === 'PASS');
  const hasTrackers = findings.some((f) => f.key.startsWith('tracker_'));
  if (!hasTrackers) earned += 15;
  else if (hasConsentBanner) earned += 10;

  const hasPayment = findings.some((f) => f.key === 'payment_providers');
  if (!hasPayment) earned += 15;
  else earned += 7;

  return Math.min(100, Math.max(0, Math.round((earned / (total + 30)) * 100)));
}
