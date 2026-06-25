import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { submitInquiry } from '../lib/firebase';
import { areas, budgetRanges } from '../lib/seedData';

const classOptions = [
  '1st', '2nd', '3rd', '4th', '5th', '6th',
  '7th', '8th', '9th', '10th', '11th', '12th',
  'JEE', 'NEET', 'Beginners', 'Intermediate',
  'Advanced', 'Placement Batch', 'Exam Preparation',
];

const initialFormState = {
  name: '',
  phone: '',
  class: '',
  subject: '',
  area: '',
  budget: '',
};

export default function InquiryForm({ instituteId, instituteName }) {
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
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
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
      await submitInquiry({
        ...form,
        instituteId: instituteId || null,
        instituteName: instituteName || null,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm(initialFormState);
      }, 4000);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="card p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-success" />
        </div>
        <h3 className="font-heading text-xl text-primary mb-2">Inquiry Submitted!</h3>
        <p className="text-text-muted">We'll get back to you soon!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-5">
      {instituteName && (
        <div className="bg-accent-light rounded-lg px-4 py-3 mb-2">
          <p className="text-sm font-semibold text-accent">
            Inquiry for {instituteName}
          </p>
        </div>
      )}

      {/* Name */}
      <div className="form-group">
        <label htmlFor="inquiry-name" className="form-label">
          Name <span className="text-error">*</span>
        </label>
        <input
          id="inquiry-name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your full name"
          className={`form-input ${errors.name ? 'border-error' : ''}`}
        />
        {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Phone */}
      <div className="form-group">
        <label htmlFor="inquiry-phone" className="form-label">
          Phone <span className="text-error">*</span>
        </label>
        <input
          id="inquiry-phone"
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="10-digit mobile number"
          maxLength={10}
          className={`form-input ${errors.phone ? 'border-error' : ''}`}
        />
        {errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
      </div>

      {/* Class */}
      <div className="form-group">
        <label htmlFor="inquiry-class" className="form-label">Class / Level</label>
        <select
          id="inquiry-class"
          name="class"
          value={form.class}
          onChange={handleChange}
          className="form-input form-select"
        >
          <option value="">Select class or level</option>
          {classOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Subject */}
      <div className="form-group">
        <label htmlFor="inquiry-subject" className="form-label">
          Subject <span className="text-error">*</span>
        </label>
        <input
          id="inquiry-subject"
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="e.g. Mathematics, Python, Tally"
          className={`form-input ${errors.subject ? 'border-error' : ''}`}
        />
        {errors.subject && <p className="text-error text-xs mt-1">{errors.subject}</p>}
      </div>

      {/* Area */}
      <div className="form-group">
        <label htmlFor="inquiry-area" className="form-label">Area</label>
        <select
          id="inquiry-area"
          name="area"
          value={form.area}
          onChange={handleChange}
          className="form-input form-select"
        >
          <option value="">Select your area</option>
          {areas.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Budget */}
      <div className="form-group">
        <label htmlFor="inquiry-budget" className="form-label">Budget</label>
        <select
          id="inquiry-budget"
          name="budget"
          value={form.budget}
          onChange={handleChange}
          className="form-input form-select"
        >
          <option value="">Select budget range</option>
          {budgetRanges.map((b) => (
            <option key={b.label} value={b.label}>{b.label}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-accent w-full"
      >
        {submitting ? 'Submitting…' : 'Submit Inquiry'}
      </button>
    </form>
  );
}
