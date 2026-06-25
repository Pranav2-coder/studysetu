import { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { submitContact } from '../lib/firebase';

const initialFormState = {
  name: '',
  email: '',
  message: '',
};

export default function ContactPage() {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function validate() {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!form.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await submitContact(form);
      setSubmitted(true);
      setForm(initialFormState);
    } catch (err) {
      console.error('Contact submission error:', err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SEOHead
        title="Contact Us — StudySetu Nagpur"
        description="Get in touch with StudySetu. Have questions or want to list your institute? We'd love to hear from you."
      />

      <div className="section bg-bg">
        <div className="container max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-heading text-3xl md:text-4xl text-primary mb-3">
              Get in Touch
            </h1>
            <p className="text-text-muted text-base md:text-lg max-w-lg mx-auto">
              Have questions? Want to list your institute? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              {submitted ? (
                <div className="card p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="w-16 h-16 text-success" />
                  </div>
                  <h3 className="font-heading text-xl text-primary mb-2">Message Sent!</h3>
                  <p className="text-text-muted">
                    Thanks for reaching out. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-5">
                  {/* Name */}
                  <div className="form-group">
                    <label htmlFor="contact-name" className="form-label">Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="form-input"
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label htmlFor="contact-email" className="form-label">
                      Email <span className="text-error">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`form-input ${errors.email ? 'border-error' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-error text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="form-group">
                    <label htmlFor="contact-message" className="form-label">
                      Message <span className="text-error">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      rows={5}
                      className={`form-input resize-y ${errors.message ? 'border-error' : ''}`}
                    />
                    {errors.message && (
                      <p className="text-error text-xs mt-1">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary w-full"
                  >
                    {submitting ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Alternative Contact */}
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-heading text-lg text-primary mb-5">Other Ways to Reach Us</h3>

                <div className="space-y-5">
                  {/* WhatsApp */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary text-sm mb-1">WhatsApp</p>
                      <a
                        href="https://wa.me/919371742672"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline text-sm"
                      >
                        +91 93717 42672
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary text-sm mb-1">Email</p>
                      <a
                        href="mailto:contact@studysetu.in"
                        className="text-accent hover:underline text-sm"
                      >
                        contact@studysetu.in
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary text-sm mb-1">Location</p>
                      <p className="text-text-muted text-sm">Nagpur, Maharashtra</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
