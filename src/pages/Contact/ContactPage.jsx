import React, { useState } from 'react';
import { contactService } from '../../services/contactService';
import { useToast } from '../../context/ToastContext';
import { Phone, Mail, Send, CheckCircle2, MapPin, Clock, MessageSquare } from 'lucide-react';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.includes('@') || !formData.message.trim()) {
      showToast('Please fill in your name, email, and message.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await contactService.submitContactForm(formData);
      setSubmitted(true);
      showToast('Thank you! Your message has been received.', 'success');
    } catch {
      showToast('Error submitting form. Please try calling or WhatsApp.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">
          We’re Here for You
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-primary-dark mt-1">
          Contact AgrivaFoods
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
          Have a question regarding our superfood powders, order shipments, or bulk orders? Reach out through any of our direct channels below.
        </p>
      </div>

      {/* 3 Contact Cards: Call, WhatsApp, Email */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Call Us Card */}
        <a
          href="tel:+918830052087"
          className="group bg-white rounded-2xl p-6 border border-sage-light shadow-premium hover:shadow-premium-hover transition-all text-center flex flex-col items-center justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all">
              <Phone className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">Call Us Directly</h3>
            <p className="text-xs text-muted mb-3">Speak with our customer support team</p>
            <span className="text-sm font-bold text-primary block">+91 88300 52087</span>
          </div>
          <span className="mt-4 px-4 py-2 bg-[#FBF7F3] border border-sage-light text-primary-dark group-hover:bg-primary group-hover:text-white rounded-xl text-xs font-bold transition-all w-full">
            Tap to Call
          </span>
        </a>

        {/* WhatsApp Card */}
        <a
          href="https://wa.me/918830052087"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-white rounded-2xl p-6 border border-sage-light shadow-premium hover:shadow-premium-hover transition-all text-center flex flex-col items-center justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mx-auto mb-4 group-hover:scale-105 group-hover:bg-[#25D366] group-hover:text-white transition-all">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">WhatsApp Chat</h3>
            <p className="text-xs text-muted mb-3">Instant chat for fast recommendations</p>
            <span className="text-sm font-bold text-[#25D366] block">+91 88300 52087</span>
          </div>
          <span className="mt-4 px-4 py-2 bg-[#25D366]/10 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white rounded-xl text-xs font-bold transition-all w-full">
            Start WhatsApp Chat
          </span>
        </a>

        {/* Email Us Card */}
        <a
          href="mailto:agrivafoods03@gmail.com"
          className="group bg-white rounded-2xl p-6 border border-sage-light shadow-premium hover:shadow-premium-hover transition-all text-center flex flex-col items-center justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all">
              <Mail className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">Email Support</h3>
            <p className="text-xs text-muted mb-3">General inquiries & bulk queries</p>
            <span className="text-xs font-bold text-primary block break-all">agrivafoods03@gmail.com</span>
          </div>
          <span className="mt-4 px-4 py-2 bg-[#FBF7F3] border border-sage-light text-primary-dark group-hover:bg-primary group-hover:text-white rounded-xl text-xs font-bold transition-all w-full">
            Compose Email
          </span>
        </a>
      </div>

      {/* Contact Form & Office Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-sage-light shadow-premium">
        {/* Left Form */}
        <div className="lg:col-span-7">
          <h2 className="text-xl font-bold text-primary-dark mb-1">Send Us a Message</h2>
          <p className="text-xs text-muted mb-6">
            Fill out the form below and our wellness support team will reply within 24 hours.
          </p>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-primary/20 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />
              <h3 className="text-base font-bold text-primary-dark">Thank You!</h3>
              <p className="text-xs text-muted max-w-sm mx-auto">
                Your message has been received in demo mode. We will get back to your email at <strong>{formData.email}</strong> shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                }}
                className="mt-2 text-xs font-bold text-primary underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nilesh Gawade"
                    className="w-full px-3.5 py-2.5 bg-[#FBF7F3] border border-sage-light rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nilesh@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#FBF7F3] border border-sage-light rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="8830052087"
                    className="w-full px-3.5 py-2.5 bg-[#FBF7F3] border border-sage-light rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Product inquiry / Order help"
                    className="w-full px-3.5 py-2.5 bg-[#FBF7F3] border border-sage-light rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Your Message *
                </label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help your superfood journey today?"
                  className="w-full px-3.5 py-2.5 bg-[#FBF7F3] border border-sage-light rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Info */}
        <div className="lg:col-span-5 bg-[#FBF7F3] rounded-2xl p-6 sm:p-8 border border-sage-light space-y-6">
          <h3 className="text-base font-bold text-primary-dark">Operating Hours & Details</h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-foreground font-semibold">Customer Support Hours:</strong>
                <span className="text-muted">Monday – Saturday: 9:00 AM – 7:00 PM IST</span>
                <span className="text-muted block mt-0.5">Sunday: Closed for farm operations</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-foreground font-semibold">Headquarters & Processing:</strong>
                <span className="text-muted">AgrivaFoods Botanical Hub</span>
                <span className="text-muted block">Maharashtra, India</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageSquare className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-foreground font-semibold">Bulk & Retail Partnerships:</strong>
                <span className="text-muted">For wholesale, gym stocking, and bulk powdered food orders, contact us via email.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
