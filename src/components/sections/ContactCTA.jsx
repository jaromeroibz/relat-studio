import { useCallback, useRef, useState } from 'react';
import { Container } from '../layout/Container.jsx';
import { Section } from '../layout/Section.jsx';
import { Label } from '../ui/Label.jsx';
import { Button } from '../ui/Button.jsx';
import { TextLink } from '../ui/TextLink.jsx';
import { useCtaReveal, CTA_EASE } from '../../hooks/useCtaReveal.js';
import { cn } from '../../lib/cn.js';
import {
  submitEnquiry,
  ENQUIRY_FORM_NAME,
  ENQUIRY_HONEYPOT,
} from '../../lib/enquiry.js';
import { getContent } from '../../data/index.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The closing chapter.
 *
 * The site ends on the dark ground with an invitation, which is also where the
 * footer sits — so the last thing on the page is one continuous surface rather
 * than a section followed by a strip of links.
 *
 * The headline uses the hero's masked reveal for the third and last time.
 * Three uses across the homepage is the point at which a gesture reads as a
 * voice; a fourth would make it a tic.
 *
 * It enters in three beats while About's black curtain is still rising (see
 * useCtaReveal): START A PROJECT above (PosterCTA), then this left column,
 * then the form, field by field. Its content sits above the curtain (`z-[70]`)
 * — always over black, never over About's cream.
 */
export function ContactCTA() {
  const { contact, site } = getContent();
  const leftRef = useRef(null);
  const formRef = useRef(null);

  // Beat 2: the heading rises through its word masks, then the label, copy
  // and contact details settle in behind it — small, restrained movement.
  const buildLeft = useCallback((gsap, group) => {
    const words = group.querySelectorAll('[data-cta-word]');
    const items = group.querySelectorAll('[data-cta-item]');
    gsap.set(words, { yPercent: 110 });
    gsap.set(items, { opacity: 0, y: 14 });
    return gsap
      .timeline()
      .to(words, { yPercent: 0, duration: 0.5, ease: CTA_EASE, stagger: 0.06 }, 0)
      .to(items, { opacity: 1, y: 0, duration: 0.5, ease: CTA_EASE, stagger: 0.09 }, 0.08);
  }, []);
  // Each beat may start once the curtain is further along: the left column
  // at ~70%, the form at ~80%.
  useCtaReveal({ groupRef: leftRef, build: buildLeft, curtainAt: 0.7, length: 0.4 });

  // Beat 3: the form, one field at a time — not one block.
  const buildForm = useCallback((gsap, group) => {
    const items = group.querySelectorAll('[data-cta-form-item]');
    gsap.set(items, { opacity: 0, y: 18 });
    return gsap
      .timeline()
      .to(items, { opacity: 1, y: 0, duration: 0.55, ease: CTA_EASE, stagger: 0.08 }, 0);
  }, []);
  useCtaReveal({ groupRef: formRef, build: buildForm, curtainAt: 0.8, length: 0.4 });

  return (
    <Section theme="dark" data-theme="dark" space="lg" className="bg-bg text-fg">
      {/* `id="contact"` lives here, not on `Section` — see the matching note
        * in SelectedWork.jsx. */}
      <Container id="contact" width="wide" className="relative z-[70]">
        <div className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
          <div ref={leftRef} className="col-span-4 md:col-span-8 lg:col-span-6">
            <div data-cta-item>
              <Label>{contact.label}</Label>
            </div>

            <h2 aria-label={contact.heading} className="hero-headline mt-lg text-display-2">
              <span aria-hidden="true" className="cta-words">
                {contact.heading.split(' ').map((word, i) => (
                  <span key={i} className="cta-mask">
                    <span data-cta-word className="cta-mask-inner">
                      {word}
                    </span>
                  </span>
                ))}
              </span>
            </h2>

            <p data-cta-item className="mt-lg max-w-text text-body-lg text-fg-muted">
              {contact.body}
            </p>

            <div data-cta-item className="mt-2xl flex flex-col gap-2xs">
              <TextLink href={`mailto:${site.contact.email}`} className="text-body-lg">
                {site.contact.email}
              </TextLink>
              <span className="font-mono text-micro uppercase tracking-label text-fg-subtle">
                {site.location}
              </span>
            </div>
          </div>

          <div
            ref={formRef}
            className="col-span-4 mt-2xl md:col-span-8 lg:col-span-5 lg:col-start-8 lg:mt-0"
          >
            <ContactForm form={contact.form} email={site.contact.email} />
          </div>
        </div>
      </Container>
    </Section>
  );
}

/**
 * A short project enquiry.
 *
 * Validation is real. Delivery is not yet: `submitEnquiry` reports
 * `not-configured` until a submission path is chosen, and the form says
 * exactly that. Faking a success message would be worse than having no form.
 *
 * The integration lives in src/lib/enquiry.js — one function body away from
 * working, with the recommendation written down beside it.
 */
function ContactForm({ form, email }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const validate = () => {
    const next = {};
    for (const field of form.fields) {
      const value = (values[field.name] ?? '').trim();
      if (field.required && !value) next[field.name] = 'Required';
      else if (field.type === 'email' && value && !EMAIL_PATTERN.test(value))
        next[field.name] = 'Enter a valid email address';
    }
    return next;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(`field-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setBusy(true);
    const result = await submitEnquiry(values);
    setBusy(false);
    setStatus(result.ok ? 'sent' : (result.reason ?? 'server'));
    if (result.ok) setValues({});
  };

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="flex flex-col gap-lg"
      // Netlify detects forms by parsing the built HTML. These attributes and
      // the hidden `form-name` input below are what make this form — the real
      // one, already prerendered — the registered one, so there is no
      // duplicate static copy to drift out of sync.
      name={ENQUIRY_FORM_NAME}
      method="POST"
      data-netlify="true"
      data-netlify-honeypot={ENQUIRY_HONEYPOT}
    >
      <input type="hidden" name="form-name" value={ENQUIRY_FORM_NAME} />

      {/* Bot trap. Hidden from sight, from assistive technology and from the
        * tab order — anything that fills it is not a person. */}
      <p className="hidden" aria-hidden="true">
        <label>
          Do not fill this in
          <input
            name={ENQUIRY_HONEYPOT}
            tabIndex={-1}
            autoComplete="off"
            value={values[ENQUIRY_HONEYPOT] ?? ''}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                [ENQUIRY_HONEYPOT]: event.target.value,
              }))
            }
          />
        </label>
      </p>

      {form.fields.map((field) => {
        const id = `field-${field.name}`;
        const error = errors[field.name];
        const shared = {
          id,
          name: field.name,
          autoComplete: field.autoComplete,
          'aria-invalid': error ? 'true' : undefined,
          'aria-describedby': error ? `${id}-error` : undefined,
          value: values[field.name] ?? '',
          onChange: (event) =>
            setValues((current) => ({ ...current, [field.name]: event.target.value })),
          className: cn(
            'w-full border-0 border-b bg-transparent py-2xs text-body',
            'placeholder:text-fg-subtle focus-visible:outline-none',
            'transition-colors duration-[--duration-fast]',
            error ? 'border-accent' : 'border-line-strong focus-visible:border-fg'
          ),
        };

        return (
          <div key={field.name} data-cta-form-item className="flex flex-col gap-3xs">
            <label
              htmlFor={id}
              className="font-mono text-micro uppercase tracking-label text-fg-subtle"
            >
              {field.label}
              {!field.required && <span className="ml-2xs normal-case">(optional)</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea rows={4} {...shared} />
            ) : (
              <input type={field.type} {...shared} />
            )}

            {error && (
              <span
                id={`${id}-error`}
                className="font-mono text-micro uppercase tracking-label text-accent"
              >
                {error}
              </span>
            )}
          </div>
        );
      })}

      <div data-cta-form-item className="flex flex-col gap-md">
        <Button type="submit" variant="primary" className="self-start" disabled={busy}>
          {busy ? 'Sending…' : form.submit}
        </Button>

        {/* Always in the DOM so a screen reader hears the result announced
          * rather than discovering new content it was never told about. */}
        <p
          role="status"
          aria-live="polite"
          className="max-w-text text-body-sm text-fg-muted empty:hidden"
        >
          {status === 'not-configured' && (
            <span className="block border-t border-line pt-md">
              {form.pendingNotice.split(email)[0]}
              <TextLink href={`mailto:${email}`}>{email}</TextLink>
              {form.pendingNotice.split(email)[1]}
            </span>
          )}
          {status === 'sent' && (
            <span className="block border-t border-line pt-md">
              Thank you — we will be in touch.
            </span>
          )}
          {status === 'server' && (
            <span className="block border-t border-line pt-md">
              Something went wrong sending that. Please email{' '}
              <TextLink href={`mailto:${email}`}>{email}</TextLink> instead.
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
