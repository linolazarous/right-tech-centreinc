import React from 'react';

const PrivacyContent = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg prose-indigo dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Introduction</h2>
        <p>
          Welcome to Right Tech Centre ("we," "our," or "us"). We are committed to protecting your personal 
          information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, 
          and safeguard your information when you visit our website and use our services.
        </p>

        <h2>2. Information We Collect</h2>
        <h3>Personal Information</h3>
        <p>We may collect personal information that you voluntarily provide to us, including:</p>
        <ul>
          <li>Name and contact information (email address, phone number)</li>
          <li>Demographic information (age, gender, location)</li>
          <li>Educational background and interests</li>
          <li>Payment information for course enrollment</li>
          <li>Student performance and progress data</li>
        </ul>

        <h3>Automatically Collected Information</h3>
        <p>When you visit our website, we may automatically collect:</p>
        <ul>
          <li>IP address and browser type</li>
          <li>Device information and operating system</li>
          <li>Usage data and browsing patterns</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide and maintain our educational services</li>
          <li>Process your enrollments and payments</li>
          <li>Personalize your learning experience</li>
          <li>Communicate with you about courses, updates, and promotions</li>
          <li>Improve our website and services</li>
          <li>Ensure security and prevent fraud</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>4. Data Sharing and Disclosure</h2>
        <p>We may share your information with:</p>
        <ul>
          <li>Instructors and teaching assistants for course delivery</li>
          <li>Payment processors for transaction processing</li>
          <li>Analytics providers to understand usage patterns</li>
          <li>Legal authorities when required by law</li>
          <li>Third-party service providers who assist in our operations</li>
        </ul>

        <h2>5. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information. However, 
          no method of transmission over the Internet or electronic storage is 100% secure, and we 
          cannot guarantee absolute security.
        </p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access and receive a copy of your personal data</li>
          <li>Rectify inaccurate or incomplete information</li>
          <li>Request deletion of your personal data</li>
          <li>Object to or restrict processing of your data</li>
          <li>Data portability to another service provider</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <h2>7. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar technologies to track activity on our website and store certain 
          information. You can instruct your browser to refuse all cookies or to indicate when a cookie 
          is being sent.
        </p>

        <h2>8. Children's Privacy</h2>
        <p>
          Our services are not intended for children under 13 years of age. We do not knowingly collect 
          personal information from children under 13. If you are a parent or guardian and believe your 
          child has provided us with personal information, please contact us.
        </p>

        <h2>9. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than your own. We ensure 
          appropriate safeguards are in place for international data transfers.
        </p>

        <h2>10. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
          the new Privacy Policy on this page and updating the "Last updated" date.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <address className="not-italic">
          Right Tech Centre<br />
          VGFM+98, North Gudele<br />
          Juba, South Sudan<br />
          Email: righttechcentre@gmail.com<br />
          Phone: +211 925 522 700
        </address>
      </div>
    </div>
  );
};

export default PrivacyContent;
