export async function fetchSite(url: string): Promise<string> {
  const normalized = url.startsWith('http') ? url : 'https://' + url;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(normalized, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'PrivacyAuditBot/1.0 (compliance-check; +https://privacyaudit.app)',
        'Accept': 'text/html',
      },
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    return text.slice(0, 500000);
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}
