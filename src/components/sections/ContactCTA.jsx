import { useState } from 'react';
import { Container } from '../layout/Container.jsx';
import { Section } from '../layout/Section.jsx';
import { Label } from '../ui/Label.jsx';
import { Button } from '../ui/Button.jsx';
import { TextLink } from '../ui/TextLink.jsx';
import { Reveal } from '../motion/Reveal.jsx';
import { HeroHeadline } from '../hero/HeroHeadline.jsx';
import { cn } from '../../lib/cn.js';
import { getContent } from '../../data/index.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The closing chapter.
 *
 * The site ends on the dark ground with an invitation, which is also where the
 * footer sits — so the last thing on the page is one continuous surface rather
 * than a section followed by a strip of links.
 *
 * The headline uses the hero's line reveal for the third and last time. Three
 * uses across the homepage is the point at which a gesture reads as a voice;
 * a fourth would make it a tic.
 */
export function ContactCTA() {
  const { contact, site } = getContent();

  return (
    <Section theme="dark" space="lg" id="contact">
      <Container width="wide">
        <div className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-6">
            <Reveal>
              <Label>{contact.label}</Label>
            </Reveal>

            <HeroHeadline
              as="h2"
              trigger="view"
              size="text-display-2"
              lines={[contact.heading]}
              label={contact.heading}
              className="mt-lg"
            />

            <Reveal delay={120}>
              <p className="mt-lg max-w-text text-body-lg text-fg-muted">
                {contact.body}
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-2xl flex flex-col gap-2xs">
                <TextLink
                  href={`mailto:${site.contact.email}`}
                  className="text-body-lg"
                >
                  {site.contact.email}
                </TextLink>
                <span className="font-mono text-micro uppercase tracking-label text-fg-subtle">
                  {site.location}
                </span>
              </div>
            </Reveal>
          </div>

          <div className="col-span-4 mt-2xl md:col-span-8 lg:col-span-5 lg:col-start-8 lg:mt-0">
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
 * Validation is real. Submission is not — there is no endpoint yet, so a valid
 * submit says exactly that and points at the email address. Faking a success
 * message would be worse than having no form at all.
 *
 * INTEGRATION POINT: replace the branch in `onSubmit` with a real POST.
 */
function ContactForm({ form, email }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

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

  const onSubmit = (event) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(`field-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    // No endpoint yet. Tell the truth rather than claim a send.
    setSubmitted(true);
  };

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-lg">
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
          <div key={field.name} className="flex flex-col gap-3xs">
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

      <div className="flex flex-col gap-md">
        <Button type="submit" variant="primary" className="self-start">
          {form.submit}
        </Button>

        {submitted && (
          <p
            role="status"
            className="max-w-text border-t border-line pt-md text-body-sm text-fg-muted"
          >
            {form.pendingNotice.split(email)[0]}
            <TextLink href={`mailto:${email}`}>{email}</TextLink>
            {form.pendingNotice.split(email)[1]}
          </p>
        )}
      </div>
    </form>
  );
}
