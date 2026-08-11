/**
 * The single point where a project enquiry leaves the site.
 *
 * Nothing is wired yet, and the form says so rather than claiming a send. This
 * module exists so that turning it on is one function body, not a change
 * spread through a component.
 *
 * ---------------------------------------------------------------------------
 * DEPLOYMENT NOTE — recommendation, not a decision
 *
 * The site is a static build on Netlify with no server and no functions
 * directory. Two deployment-native options, in order of preference:
 *
 *   1. Netlify Forms. No new account, no new dependency, no server code.
 *      Submissions appear in the Netlify dashboard with email notifications.
 *      Free tier covers 100 submissions/month, which is far beyond what a
 *      studio enquiry form will see. Requires a static form in the built HTML
 *      for Netlify's build-time parser to detect — see `netlifyFormFields`
 *      below, which is already rendered as a hidden static form.
 *      Cost: none. Lock-in: mild, and only as long as the host is Netlify.
 *
 *   2. A Netlify Function posting to an email API (Resend, Postmark). More
 *      control over formatting and routing, but it introduces a third-party
 *      account, an API key to manage, and a small recurring cost above the
 *      free tier.
 *
 * Recommended: option 1, unless enquiries need to land somewhere other than
 * email. Not enabled — awaiting a decision.
 * ---------------------------------------------------------------------------
 */

/** Whether a submission path is configured. Flip when an option is chosen. */
export const ENQUIRY_ENABLED = false;

/**
 * Netlify's build-time form parser reads static HTML, not React output, so the
 * field names it should register are declared here and rendered once in a
 * hidden static form. Keep in sync with the fields in src/data/en/contact.js.
 */
export const ENQUIRY_FORM_NAME = 'project-enquiry';
export const ENQUIRY_FIELDS = ['name', 'email', 'project', 'message'];

/**
 * @typedef {{ ok: boolean, reason?: 'not-configured'|'network'|'server' }} EnquiryResult
 *
 * @param {Record<string, string>} values
 * @returns {Promise<EnquiryResult>}
 */
export async function submitEnquiry(values) {
  const body = new URLSearchParams({ 'form-name': ENQUIRY_FORM_NAME, ...values });

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
