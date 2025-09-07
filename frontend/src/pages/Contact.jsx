import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, Mail, Clock, Send, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [emailjsLoaded, setEmailjsLoaded] = useState(false);

  // Load EmailJS script
  useEffect(() => {
    const loadEmailJS = () => {
      if (window.emailjs) {
        // EmailJS already loaded
        window.emailjs.init("qlNzNxTwKKLWNh_tV"); // Replace with your actual public key
        setEmailjsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.async = true;
      script.onload = () => {
        window.emailjs.init("qlNzNxTwKKLWNh_tV"); // Replace with your actual public key
        setEmailjsLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load EmailJS');
        setSubmitStatus('emailjs-error');
      };
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    };

    loadEmailJS();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous error status when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus('');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert('Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      alert('Please enter your email address');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    if (!formData.message.trim()) {
      alert('Please enter your message');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!emailjsLoaded) {
      alert('Email service is still loading. Please try again in a moment.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // EmailJS template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'Not provided',
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
        to_email: 'crackers.astro@gmail.com',
        timestamp: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      // Send email using EmailJS
      const response = await window.emailjs.send(
        'service_jifbhqd',    // Replace with your EmailJS service ID
        'template_s5g05vj',   // Replace with your EmailJS template ID
        templateParams,
        'qlNzNxTwKKLWNh_tV'     // Replace with your EmailJS public key
      );

      if (response.status === 200) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      // Handle the specific OAuth scope error
      if (error.text && error.text.includes('insufficient authentication scopes')) {
        setSubmitStatus('oauth-error');
      } else {
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const SuccessMessage = () => (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
        <div>
          <h3 className="text-green-800 font-semibold">Message Sent Successfully!</h3>
          <p className="text-green-700 text-sm">Thank you for contacting us. We'll respond within 2 hours.</p>
        </div>
      </div>
    </div>
  );

  const ErrorMessage = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
        <div>
          <h3 className="text-red-800 font-semibold">Error Sending Message</h3>
          <p className="text-red-700 text-sm">
            {submitStatus === 'emailjs-error'
              ? 'Failed to load email service. Please try refreshing the page or contact us directly.'
              : submitStatus === 'oauth-error'
                ? 'Email service authentication issue. Please contact us directly via phone or WhatsApp for immediate assistance.'
                : 'Something went wrong. Please try again or contact us directly via phone or email.'
            }
          </p>
          {submitStatus === 'oauth-error' && (
            <div className="mt-2 p-3 bg-red-100 rounded text-xs">
              <p className="font-medium">Quick Fix: Contact us directly:</p>
              <p>📞 Call: +91 83003 72046</p>
              <p>💬 WhatsApp: Direct message</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-700 hover:text-red-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="text-sm">Back</span>
        </button>

        {/* Compact Hero Section - Red and White theme */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl text-white py-3 px-6 mb-6 relative overflow-hidden flex items-center justify-between">

          {/* Left side: Logo */}
          <img
            src="/logo_astro.png"
            alt="Astro Crackers Logo"
            className="h-12 w-auto rounded-lg shadow-md"
          />

          {/* Center Content */}
          <div className="relative z-10 text-center flex-1">
            <h1 className="text-xl md:text-2xl font-bold mb-1">
              Get In Touch
            </h1>
            <p className="text-xs md:text-sm opacity-90">
              Ready to light up your celebrations?
            </p>
          </div>

          {/* Decorative Icons */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1 right-2 text-2xl">📞</div>
            <div className="absolute bottom-1 left-2 text-xl">💌</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Phone Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Call Us</h3>
                    <p className="text-gray-600">Available 24/7</p>
                    <a
                      href="tel:+918300372046"
                      className="text-green-600 font-medium hover:text-green-700 transition-colors"
                    >
                      +91 83003 72046
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Email Us</h3>
                    <p className="text-gray-600">Response within 2 hours</p>
                    <a
                      href="mailto:crackers.astro@gmail.com"
                      className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                      crackers.astro@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100 md:col-span-2 lg:col-span-1">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">WhatsApp</h3>
                    <p className="text-gray-600">Quick responses & order updates</p>
                    <a
                      href="https://wa.me/918300372046?text=Hi! I'm interested in your crackers for my celebration."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 font-medium hover:text-green-700 transition-colors"
                    >
                      Chat with us
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-800">Business Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">All days</span>
                  <span className="font-medium text-green-600">Open 24/7</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  <p>📞 Phone support: Always available</p>
                  <p>💬 WhatsApp: Instant responses</p>
                  <p>📧 Email: Within 2 hours</p>
                </div>
              </div>
            </div>

            {/* Order Process */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                🎯 Easy Order Process
              </h3>
              <div className="space-y-3">
                {[
                  { step: 1, text: "Browse our premium crackers collection", icon: "🎆" },
                  { step: 2, text: "Contact us via form, phone, or WhatsApp", icon: "📱" },
                  { step: 3, text: "We'll call within 2 hours to confirm", icon: "☎️" },
                  { step: 4, text: "Safe delivery to your doorstep", icon: "🚚" }
                ].map((item) => (
                  <div key={item.step} className="flex items-start space-x-3">
                    <div className="bg-red-200 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-red-700 text-sm">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Send Us a Message
              </h2>
              <p className="text-gray-600">
                Tell us about your celebration needs and we'll help you create magic!
              </p>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && <SuccessMessage />}
            {(submitStatus === 'error' || submitStatus === 'emailjs-error' || submitStatus === 'oauth-error') && <ErrorMessage />}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    placeholder="Your contact number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select a subject</option>
                  <option value="Product Inquiry">Product Inquiry</option>
                  <option value="Bulk Order">Bulk Order (Wholesale)</option>
                  <option value="Custom Gift Box">Custom Gift Box</option>
                  <option value="Price Quote">Price Quote</option>
                  <option value="Delivery Query">Delivery Query</option>
                  <option value="Festival Special">Festival Special Order</option>
                  <option value="Wedding/Event">Wedding/Event Celebration</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-vertical"
                  placeholder="Tell us about your celebration needs, required quantities, delivery location, or any specific requirements..."
                />
                <div className="text-xs text-gray-500 mt-1">
                  Minimum 10 characters. Include details about your event, preferred delivery date, and location.
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !emailjsLoaded}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-4 px-6 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Sending your message...
                  </>
                ) : !emailjsLoaded ? (
                  <>
                    <div className="animate-pulse w-5 h-5 bg-white bg-opacity-30 rounded mr-3"></div>
                    Loading email service...
                  </>
                ) : (
                  <>
                    <Send size={18} className="mr-2" />
                    Send Message
                  </>
                )}
              </button>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  🚀 We typically respond within 2 hours during business hours
                </p>
                <p className="text-xs text-gray-500">
                  For urgent inquiries, call us directly at +91 83003 72046
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;