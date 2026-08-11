/**
 * The single point where a project enquiry leaves the site.
 *
 * Netlify Forms. No server, no function, no third-party account, no
 * dependency: the site is already deployed on Netlify, and its form handler
 * intercepts the POST before any static file is served.
 *
 * Detection is build-time and reads HTML, not React. That works here only
 * because every route is prerendered — the real form is in index.html with its
 * `name`, `data-netlify` and `form-name` attributes intact, so there is no
 * need for a duplicate hidden form that could drift from the real one.
 *
 * The submission is form-encoded and must carry `form-name`. A field named
 * `email` is what Netlify uses for reply-to on notifications, so that name is
 * load-bearing — see src/data/en/contact.js.
 */

/** Whether a submission path is configured. */
export const ENQUIRY_ENABLED = true;

export const ENQUIRY_FORM_NAME = 'project-enquiry';

/**
 * Bot trap. Netlify drops any submission where this field is filled, and no
 * human ever fills it: it is display:none, aria-hidden and out of the tab
 * order. Cheaper and less hostile than a CAPTCHA — which stays off unless
 * spam actually becomes a problem.
 */
export const ENQUIRY_HONEYPOT = 'bot-field';

/**
 * @typedef {{ ok: boolean, reason?: 'not-configured'|'network'|'server' }} EnquiryResult
 *
 * @param {Record<string, string>} values
 * @returns {Promise<EnquiryResult>}
 */
export async function submitEnquiry(values) {
  const body = new URLSearchParams({
    'form-name': ENQUIRY_FORM_NAME,
    // Present but empty on every genuine submission.
    [ENQUIRY_HONEYPOT]: '',
    ...values,
  });

  if (!ENQUIRY_ENABLED) {
    return { ok: false, reason: 'not-configured' };
  }

  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    return response.ok ? { ok: true } : { ok: false, reason: 'server' };
  } catch {
    return { ok: false, reason: 'network' };
  }
}
