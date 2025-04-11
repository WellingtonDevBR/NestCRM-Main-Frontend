
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Shield, Globe, CheckCircle, FileText, Lock } from "lucide-react";

const GDPRCompliance = () => {
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
            <h1 className="text-3xl font-bold">GDPR Compliance Statement</h1>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground">
              Effective Date: 06 April 2025<br />
              Nest CRM Pty Ltd (ABN: 1234567)<br />
              Contact Email: <a href="mailto:info@nestcrm.com.au" className="text-primary">info@nestcrm.com.au</a>
            </p>
            
            <p>
              Nest CRM is committed to ensuring that your personal information is handled in accordance with the General Data Protection Regulation (EU) 2016/679 ("GDPR"), applicable to individuals in the European Union (EU) and European Economic Area (EEA). This GDPR Compliance Statement explains how Nest CRM collects, processes, stores, and protects personal data of EU users, and outlines your rights under the Regulation.
            </p>
            
            <div className="bg-secondary/40 p-6 rounded-lg my-8 border border-border">
              <div className="flex items-center mb-4">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                <h2 className="text-xl font-semibold m-0">1. Who This Applies To</h2>
              </div>
              <p className="mb-0">
                This document applies to individuals located in the EU/EEA who interact with Nest CRM services, including users of our platform, website visitors, and business contacts.
              </p>
            </div>
            
            <h2 className="text-xl font-semibold mt-8">2. Our Role Under the GDPR</h2>
            <p>Nest CRM operates as a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Data Controller</strong> when determining the purposes and means of processing personal data (e.g., marketing, user management).</li>
              <li><strong>Data Processor</strong> when handling personal data on behalf of our customers who use our CRM services.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8">3. Legal Bases for Processing</h2>
            <p>
              We process your personal data under the following lawful bases as defined by Article 6 of the GDPR:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Consent</strong> – For optional communications or specific data processing where consent is required.</li>
              <li><strong>Contractual necessity</strong> – To provide services you've signed up for (e.g., managing your CRM account).</li>
              <li><strong>Legal obligation</strong> – For compliance with EU or local legal requirements.</li>
              <li><strong>Legitimate interests</strong> – For platform improvement, fraud prevention, and customer support, provided such interests are not overridden by your rights.</li>
            </ul>
            
            <div className="bg-secondary/40 p-6 rounded-lg my-8 border border-border">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                <h2 className="text-xl font-semibold m-0">4. Your GDPR Rights</h2>
              </div>
              <p>As an EU/EEA resident, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-0">
                <li><strong>Access</strong> – Request a copy of the data we hold about you.</li>
                <li><strong>Rectification</strong> – Correct inaccurate or incomplete data.</li>
                <li><strong>Erasure ("Right to be Forgotten")</strong> – Delete your personal data, subject to legal exceptions.</li>
                <li><strong>Restriction of Processing</strong> – Request limitation of how we use your data.</li>
                <li><strong>Data Portability</strong> – Receive your data in a structured, commonly used format.</li>
                <li><strong>Object to Processing</strong> – Object to certain types of data processing, including profiling.</li>
                <li><strong>Withdraw Consent</strong> – Where processing is based on consent, you may withdraw it at any time without affecting the lawfulness of prior processing.</li>
              </ul>
              <p className="mt-4 mb-0">
                To exercise any of the above rights, contact: <a href="mailto:info@nestcrm.com.au" className="text-primary">info@nestcrm.com.au</a>
              </p>
            </div>
            
            <h2 className="text-xl font-semibold mt-8">5. International Data Transfers</h2>
            <p>
              Nest CRM is based in Australia, and some of your personal data may be transferred outside the EU/EEA to deliver services. All such transfers are:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Subject to adequate data protection measures, such as the Standard Contractual Clauses (SCCs) approved by the European Commission.</li>
              <li>Encrypted during transmission and stored securely in compliance with GDPR requirements.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8">6. Data Retention</h2>
            <p>
              We retain personal data only as long as necessary to fulfill the purposes outlined in our Privacy Policy, or as required by applicable law. After this period, data is securely deleted or anonymised.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">7. Data Security</h2>
            <p>We implement appropriate technical and organisational measures including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Data encryption at rest and in transit</li>
              <li>Access controls and user authentication</li>
              <li>Secure hosting infrastructure via Amazon Web Services (AWS)</li>
              <li>Regular audits and security reviews</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8">8. Use of Cookies</h2>
            <p>
              Nest CRM uses cookies in line with GDPR and the ePrivacy Directive. You can manage your cookie preferences through your browser or via our cookie consent banner. For more information, see our <Link to="/cookie-policy" className="text-primary">Cookie Policy</Link>.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">9. Subprocessors and Third Parties</h2>
            <p>
              We may share data with trusted third-party service providers under strict data processing agreements to support:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email communication (e.g., SendGrid)</li>
              <li>Payment processing (e.g., Stripe)</li>
              <li>Analytics and customer support tools</li>
            </ul>
            <p>
              All subprocessors are reviewed for GDPR compliance and operate under data processing agreements.
            </p>
            
            <div className="bg-secondary/40 p-6 rounded-lg my-8 border border-border">
              <div className="flex items-center mb-4">
                <Lock className="h-5 w-5 mr-2 text-primary" />
                <h2 className="text-xl font-semibold m-0">10. Data Protection Officer (DPO)</h2>
              </div>
              <p className="mb-0">
                For GDPR-related inquiries, you may contact our Data Protection Officer at:<br /><br />
                Email: <a href="mailto:dpo@nestcrm.com.au" className="text-primary">dpo@nestcrm.com.au</a><br />
                Postal Address: Level 12, 100 King William Street, Adelaide, South Australia 5000
              </p>
            </div>
            
            <h2 className="text-xl font-semibold mt-8">11. Complaints</h2>
            <p>If you believe your data rights have been violated, you may lodge a complaint with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your local EU data protection authority, or</li>
              <li>Contact us directly at <a href="mailto:info@nestcrm.com.au" className="text-primary">info@nestcrm.com.au</a> for prompt resolution.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8">12. Updates to This Statement</h2>
            <p>
              We may update this GDPR Compliance Statement periodically. Updates will be posted on our website with a clear revision date.
            </p>
            
            <p className="text-muted-foreground mt-8">
              Last updated: 06 April 2025
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default GDPRCompliance;
