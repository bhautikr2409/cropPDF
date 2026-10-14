import { useState } from 'react';
import toast from 'react-hot-toast';
import StaticPageShell from '../components/layout/StaticPageShell';
import SeoHead from '../components/seo/SeoHead';
import { CONTACT_EMAIL } from '../constants';
import { SITE_NAME } from '../constants/site';
import { STATIC_SEO } from '../constants/seoContent';

const fieldClass =
  'w-full rounded-xl border border-ink-200 px-4 py-2.5 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20';

/** Free client-side delivery to CONTACT_EMAIL (FormSubmit). First use needs inbox confirmation. */
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openMailtoFallback = () => {
    const subject = encodeURIComponent(formData.subject.trim() || `${SITE_NAME} contact`);
    const body = encodeURIComponent(
      `Name: ${formData.name.trim()}\nReply-to: ${formData.email.trim()}\n\n${formData.message.trim()}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim() || `${SITE_NAME} contact`;
    const message = formData.message.trim();

    if (!name || !email || !message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
          body: JSON.stringify({
            name,
            email,
            _replyto: email,
            _subject: subject,
            message,
            _template: 'table',
            _captcha: 'false',
            _honey: '',
          }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.message || 'Could not send message.');
      }

      toast.success('Message sent — we will reply to your email soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Direct send failed. Opening your email app instead…');
      openMailtoFallback();
    } finally {
      setIsSending(false);
    }
  };

  const seo = STATIC_SEO.contact;

  return (
    <StaticPageShell narrow>
      <SeoHead
        title={seo.title}
        description={seo.description}
        path={seo.path}
        keywords={seo.keywords}
      />
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            Contact {SITE_NAME}
          </h1>
          <p className="text-ink-500">
            Send feedback or questions about croppdf.netlify.app. Messages go to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand-700 hover:underline">
              {CONTACT_EMAIL}
            </a>
            . We will reply to the email you enter below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-ink-700">
              Your name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              required
              disabled={isSending}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink-700">
              Your email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              disabled={isSending}
              className={fieldClass}
            />
            <p className="mt-1.5 text-xs text-ink-500">We use this to reply to you.</p>
          </div>

          <div>
            <label htmlFor="subject" className="mb-1.5 block text-sm font-semibold text-ink-700">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="General inquiry"
              disabled={isSending}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-ink-700">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we help?"
              required
              disabled={isSending}
              className={`${fieldClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand-700 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
          >
            {isSending ? 'Sending…' : 'Send message'}
          </button>

          <p className="text-center text-xs text-ink-400">
            First-time setup: check{' '}
            <span className="font-medium text-ink-500">{CONTACT_EMAIL}</span> for a FormSubmit
            confirmation email and activate the form.
          </p>
        </form>
      </div>
    </StaticPageShell>
  );
}
