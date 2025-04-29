import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-orange-500 mb-6">About Us</h1>

        <section>
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">🧡 Our Mission</h2>
          <p className="text-lg text-gray-700 mb-4">
            <strong>FindMyHelper</strong> is your trusted destination for connecting with skilled, reliable, and verified service professionals — right when and where you need them.
          </p>
          <p className="text-lg text-gray-700">
            Whether it's fixing a leaking tap, cleaning your home, repairing your AC, or finding a qualified tutor for your child, our mission is simple:
            <br />
            <strong>To make your life easier by bringing helpers to your doorstep — safely, quickly, and affordably.</strong>
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">🛠️ What We Do</h2>
          <p className="text-lg text-gray-700 mb-4">
            We bridge the gap between <strong>people who need help</strong> and <strong>people who offer help</strong>.
          </p>
          <ul className="list-disc pl-6 text-lg text-gray-700">
            <li>🔧 Electricians, plumbers, carpenters, and home repair experts</li>
            <li>🧹 Cleaners, pest control, and maintenance professionals</li>
            <li>👩‍🏫 Tutors, caregivers, and other personal service providers</li>
            <li>And many more!</li>
          </ul>
          <p className="text-lg text-gray-700 mt-4">
            Each helper on our platform goes through verification, so you can rest easy knowing you’re hiring someone you can trust.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">🚀 Our Vision</h2>
          <p className="text-lg text-gray-700">
            To build India’s most accessible and reliable <strong>on-demand service marketplace</strong> — empowering local workers and delighting customers in every neighborhood.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">🤝 Our Values</h2>
          <ul className="list-disc pl-6 text-lg text-gray-700">
            <li><strong>Trust & Transparency:</strong> Verified profiles, user reviews, and clear communication</li>
            <li><strong>Empowerment:</strong> We uplift helpers by giving them visibility, dignity, and more income</li>
            <li><strong>Speed & Simplicity:</strong> Book help in minutes — no middlemen, no hassle</li>
            <li><strong>Community First:</strong> We believe in local solutions for local needs</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">🌍 Who We Serve</h2>
          <p className="text-lg text-gray-700">
            From busy professionals and families to students and senior citizens — <strong>anyone who needs a helping hand</strong> can find it here.
          </p>
          <p className="text-lg text-gray-700">
            We’re proudly building a network of thousands of helpers and happy customers across towns and cities.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">📱 Why Choose FindMyHelper?</h2>
          <ul className="list-disc pl-6 text-lg text-gray-700">
            <li>✅ Trusted & verified professionals</li>
            <li>⏱️ Quick bookings and real-time availability</li>
            <li>💬 Chat, review, and choose the right fit for you</li>
            <li>💳 Secure payments and transparent pricing</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">💡 The Team Behind It</h2>
          <p className="text-lg text-gray-700">
            We’re a passionate team of engineers, designers, and dreamers who believe that access to help shouldn’t be a privilege — it should be a click away.
          </p>
        </section>

        <section className="mt-8 text-center">
          <p className="text-lg text-orange-600 font-semibold">FindMyHelper: Help at Your Fingertips.</p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
