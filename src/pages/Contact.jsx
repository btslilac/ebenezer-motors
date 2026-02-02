import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="bg-brand-surface">
      {/* Hero */}
      <section className="bg-brand-primary py-20 text-black">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="font-heading text-4xl font-semibold md:text-5xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-black/80">
            Looking to buy, hire, or trade in a car? Our team is ready to assist.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Form */}
          <div className="rounded-2xl border border-brand-muted/60 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-heading font-semibold text-brand-primary">
              Send us a message
            </h2>

            <form className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full rounded-full border border-brand-muted px-5 py-3 text-sm focus:border-brand-accent focus:outline-none"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-full border border-brand-muted px-5 py-3 text-sm focus:border-brand-accent focus:outline-none"
                required
              />
              <textarea
                placeholder="Your Message"
                rows="4"
                className="w-full rounded-2xl border border-brand-muted px-5 py-3 text-sm focus:border-brand-accent focus:outline-none"
                required
              />
              <button
                type="submit"
                className="w-full rounded-full bg-muted px-6 py-3 text-sm font-semibold text-black transition hover:bg-accentDark"
              >
                Send Message
              </button>
              {/* I need to add pop up that says success */}
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-brand-muted/60 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <Mail className="text-brand-accent" />
                <div>
                  <p className="font-semibold text-brand-primary">Email</p>
                  <p className="text-sm text-slate-500">
                    info@ebenezermotors.co.ke
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-muted/60 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <Phone className="text-brand-accent" />
                <div>
                  <p className="font-semibold text-brand-primary">Phone</p>
                  <p className="text-sm text-slate-500">+254 722 263 192</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-muted/60 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <MapPin className="text-brand-accent" />
                <div>
                  <p className="font-semibold text-brand-primary">Location</p>
                  <p className="text-sm text-slate-500">
                    Kisumu, Kenya
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
