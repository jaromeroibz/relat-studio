/**
 * Contact — English.
 *
 * The homepage ends with an invitation, not a pitch. See
 * docs/E-brand-constitution.md §23: no "get started now", no urgency, no
 * consultation booking language.
 */

export const contact = {
  label: 'Contact',
  // A non-breaking space between "Start" and "a" keeps that lone article
  // from stranding on its own line when this wraps inside Contact's
  // narrower column — see HeroHeadline's `noWrap` prop.
  heading: 'Start a conversation.',
  body: 'Have a project, an idea, or simply something that needs to work better?',

  form: {
    fields: [
      { name: 'name', label: 'Name', type: 'text', autoComplete: 'name', required: true },
      { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
      {
        name: 'project',
        label: 'Company or project',
        type: 'text',
        autoComplete: 'organization',
        required: false,
      },
      {
        name: 'message',
        label: 'Tell us about it',
        type: 'textarea',
        required: true,
      },
    ],
    submit: 'Send',

    /**
     * PENDING INTEGRATION.
     *
     * There is no submission endpoint yet, so the form validates and then says
     * exactly that. It does not pretend to have sent anything — a false
     * success message is worse than no form. The email address below is the
     * working path until an endpoint exists.
     */
    pendingNotice:
      'This form is not connected yet. For now, email hello@relat.studio directly — it reaches the same place.',
  },
};
