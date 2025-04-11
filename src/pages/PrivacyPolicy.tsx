
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, ArrowLeft, FileText, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container-custom py-16 flex-grow">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground">Effective Date: 06 April 2025</p>
            
            <p>
              This Privacy Policy outlines how Nest CRM Pty Ltd ("Nest CRM", "we", "our", or "us") collects, uses, stores, 
              and protects your personal information in accordance with the Privacy Act 1988 (Cth), including the Australian 
              Privacy Principles (APPs). By using our services, you consent to the practices described in this Policy.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">1. Welcome to Nest CRM!</h2>
            <p>
              We are committed to protecting your privacy. This document provides transparent and detailed information 
              about how we manage your data in line with Australian law.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">2. Information We Collect</h2>
            <p>
              When you sign up or interact with Nest CRM, we may collect the following categories of personal information:
            </p>
            
            <div className="bg-secondary/30 p-4 rounded-md my-4">
              <h3 className="text-lg font-medium">Basic Personal Info:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Full Name</li>
                <li>Email Address</li>
                <li>Phone Number</li>
                <li>Company Name</li>
              </ul>
              <p className="text-sm italic mt-1">Purpose: To customise your experience, contact you, and manage your account.</p>
            </div>
            
            <div className="bg-secondary/30 p-4 rounded-md my-4">
              <h3 className="text-lg font-medium">Usage Data:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Pages Visited</li>
                <li>Features Used</li>
                <li>Time Spent on Sections</li>
              </ul>
              <p className="text-sm italic mt-1">Purpose: To improve navigation, optimise performance, and understand feature engagement.</p>
            </div>
            
            <div className="bg-secondary/30 p-4 rounded-md my-4">
              <h3 className="text-lg font-medium">Technical Data:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Browser Type</li>
                <li>Device Information</li>
                <li>IP Address</li>
                <li>Login Timestamps</li>
              </ul>
              <p className="text-sm italic mt-1">Purpose: To enhance account security, monitor performance, and prevent fraud.</p>
            </div>
            
            <div className="bg-secondary/30 p-4 rounded-md my-4">
              <h3 className="text-lg font-medium">Communications Data:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Support Messages</li>
                <li>Emails Exchanged</li>
                <li>Chat Interactions</li>
              </ul>
              <p className="text-sm italic mt-1">Purpose: To assist with customer service and internal support documentation.</p>
            </div>
            
            <div className="bg-secondary/30 p-4 rounded-md my-4">
              <h3 className="text-lg font-medium">Cookies & Tracking Technologies:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Session Tokens</li>
                <li>Theme Preferences</li>
                <li>Login Persistence</li>
              </ul>
              <p className="text-sm italic mt-1">Purpose: To maintain sessions, remember preferences, and improve user experience.</p>
            </div>
            
            <h2 className="text-xl font-semibold mt-8">3. Why We Collect This Information</h2>
            <p>
              We collect your data for the following lawful purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide core CRM services</li>
              <li>To personalize your experience</li>
              <li>To communicate updates, alerts, and service support</li>
              <li>To improve our platform</li>
              <li>To ensure security and detect unauthorized activity</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8">4. Disclosure of Your Information</h2>
            <p>
              Nest CRM does not sell your personal data. We may disclose your data only:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To trusted service providers (e.g., email and payment processors) strictly for operating our services</li>
              <li>Where legally required to comply with court orders, law enforcement, or regulatory obligations</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8">5. Data Security</h2>
            <p>
              We implement security measures aligned with industry best practices to protect your information. These include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure infrastructure hosted on AWS</li>
              <li>Access control protocols and regular audits</li>
            </ul>
            <p>
              Although no system is completely secure, we are committed to ongoing risk management and mitigation.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">6. Your Rights and Choices</h2>
            <p>
              Under Australian privacy law, you have rights to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Request access to personal information we hold about you</li>
              <li>Correct any inaccurate or incomplete personal data</li>
              <li>Request deletion of your personal data (subject to legal obligations)</li>
            </ul>
            <p>
              You may also opt out of communications or adjust your privacy settings in your account.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">7. External Links</h2>
            <p>
              Our platform may contain links to external websites. Nest CRM is not responsible for the privacy practices 
              or content of third-party sites. We encourage users to review the privacy statements of each site they visit.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be communicated through email or dashboard 
              alerts. The latest version will always be available on our website with the effective date clearly indicated.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, or if you wish to access or update your personal information, 
              please contact us:
            </p>
            <p>
              Email: <a href="mailto:info@nestcrm.com.au" className="text-primary hover:underline">info@nestcrm.com.au</a>
            </p>
            <p>
              Postal Address: George St, NSW 2000 Australia
            </p>
            
            <div className="bg-secondary/40 p-6 rounded-lg my-8 border border-border">
              <div className="flex items-center mb-4">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                <h2 className="text-xl font-semibold m-0">Australian Privacy Compliance</h2>
              </div>
              <p>
                Nest CRM complies with the Privacy Act 1988 (Cth) and adheres to the Australian 
                Privacy Principles (APPs). We are committed to protecting the personal information you 
                entrust to us and to ensuring the secure and responsible management of that data.
              </p>
            </div>
            
            <h2 className="text-xl font-semibold mt-8">Your Rights Under Australian Law</h2>
            <p>Under the Privacy Act 1988, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Know what personal information we collect and why</li>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate or outdated personal information</li>
              <li>Make a privacy complaint about how your data is handled</li>
            </ul>
            
            <p className="mt-4">
              To exercise any of these rights, please contact us at: 
              <a href="mailto:info@nestcrm.com.au" className="text-primary hover:underline mx-1">
                info@nestcrm.com.au
              </a>
            </p>
            
            <h2 className="text-xl font-semibold mt-8">How We Handle Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nest CRM collects only the data necessary to deliver and optimize our services</li>
              <li>Data is stored securely and may only be shared with authorized third-party service providers under strict confidentiality agreements</li>
              <li>We do not sell or disclose customer data except where required by law</li>
            </ul>
            
            <div className="bg-secondary/40 p-6 rounded-lg my-8 border border-border">
              <div className="flex items-center mb-4">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                <h2 className="text-xl font-semibold m-0">GDPR Compliance for EU Users</h2>
              </div>
              <p>
                If you are located in the European Union, your data is also subject to the General 
                Data Protection Regulation (GDPR). Nest CRM commits to GDPR-aligned practices in the 
                collection, processing, and retention of your personal information.
              </p>
            </div>
            
            <h2 className="text-xl font-semibold mt-8">Your Rights Under the GDPR</h2>
            <p>As an EU resident, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access a copy of the personal data we hold about you</li>
              <li>Correct or delete your personal data</li>
              <li>Restrict or object to processing of your data</li>
              <li>Receive your data in a portable format</li>
              <li>Withdraw consent at any time where processing is based on consent</li>
            </ul>
            
            <p className="mt-4">
              To exercise your GDPR rights, contact us at: 
              <a href="mailto:info@nestcrm.com.au" className="text-primary hover:underline mx-1">
                info@nestcrm.com.au
              </a>
            </p>
            
            <h2 className="text-xl font-semibold mt-8">Our Commitments to You</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We obtain clear and informed consent for communications and data use</li>
              <li>Your data is stored using secure infrastructure and encryption methods</li>
              <li>We maintain transparency in our data processing activities and purposes</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
