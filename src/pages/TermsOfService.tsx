
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, ArrowLeft, Shield, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
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
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Terms of Service</h1>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground">Effective Date: 20 April 2025</p>
            
            <p>
              This Terms of Service ("Agreement") constitutes a legally binding contract between you ("Customer", "you", or "your") 
              and Nest CRM Pty Ltd ("Nest CRM", "we", "us", or "our"). By accessing or using the Nest CRM platform and associated 
              services, you agree to comply with and be bound by this Agreement. If you do not agree, you may not use the platform.
            </p>
            <p>
              For legal or support inquiries, contact us at <a href="mailto:help@nestcrm.com.au" className="text-primary hover:underline">help@nestcrm.com.au</a>.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">1. Parties to the Agreement</h2>
            <p>
              Nest CRM is an Australian-owned cloud-based platform offering customer relationship management (CRM) software and related services.
              The Customer is either an individual with legal capacity or an authorized representative of a legal entity using the Nest CRM services.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">2. Description of Service</h2>
            <p>
              Nest CRM provides subscription-based access to a CRM platform with customizable tools for customer engagement, 
              workflow automation, communication, retention tracking, and AI-driven analytics. A 14-day free trial may be offered 
              before subscription is required.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">3. Account Registration and Responsibility</h2>
            <p>
              To use the platform, Customers must register an account and:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide truthful, accurate information</li>
              <li>Keep login credentials secure</li>
              <li>Assume full responsibility for activity on their account</li>
            </ul>
            <p>
              Users must be 18 years or older, or have legal authority to bind an organisation to these terms.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">4. Customer Data and Privacy</h2>
            <p>
              All Customer Data remains the sole property of the Customer. Nest CRM receives a limited license to process 
              this data only as required to deliver services.
              We commit to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Keeping Customer Data secure and confidential</li>
              <li>Processing data in accordance with our <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> and 
              Australian privacy legislation (including the Privacy Act 1988 (Cth) and the Australian Privacy Principles).</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8">5. Subscription, Free Trial, and Payment</h2>
            <p>
              Following the free trial, continued service access requires a valid subscription.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pricing and billing details are defined upon plan selection</li>
              <li>Fees are non-refundable unless required by Australian Consumer Law</li>
              <li>Nest CRM reserves the right to adjust prices with advance notice</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8">6. Termination and Suspension</h2>
            <p>
              Either party may terminate the Agreement at any time:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Customers by ceasing platform use and notifying support</li>
              <li>Nest CRM by notice in response to violations, unpaid invoices, or compliance requirements</li>
            </ul>
            <p>
              Upon termination:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Data may be deleted after 30 days</li>
              <li>Unpaid charges are due immediately</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8">7. Acceptable Use</h2>
            <p>
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any law or regulation</li>
              <li>Use the platform for unauthorized mass messaging or spam</li>
              <li>Reverse-engineer, decompile, or tamper with the platform</li>
              <li>Introduce malware or exploit vulnerabilities</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8">8. Intellectual Property</h2>
            <p>
              All intellectual property including trademarks, code, architecture, and branding remain the exclusive property 
              of Nest CRM Pty Ltd.
            </p>
            <p>
              Customers receive a non-exclusive, non-transferable right to use the platform for internal business operations.
            </p>
            <p>
              No part of the system may be copied, resold, or sublicensed without prior written permission.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">9. Disclaimers and Limitation of Liability</h2>
            <p>
              Nest CRM is delivered "as is" and "as available". We make no warranties of uninterrupted service or error-free 
              functionality.
            </p>
            <p>
              To the maximum extent permitted by Australian law:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We disclaim warranties including merchantability or fitness for purpose</li>
              <li>We are not liable for indirect or incidental damages</li>
              <li>Our total liability shall not exceed the subscription fees paid in the 12 months prior to the claim</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8">10. Modifications to Terms</h2>
            <p>
              We may revise these Terms from time to time. Significant changes will be communicated with 14 days' notice 
              via the platform or email.
            </p>
            <p>
              Continued use after the effective date constitutes acceptance of revised terms.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">11. Governing Law and Jurisdiction</h2>
            <p>
              This Agreement is governed by the laws of the State of South Australia, Australia.
            </p>
            <p>
              Disputes arising under this Agreement shall be resolved in the courts of Adelaide, South Australia.
            </p>
            <p>
              Nothing in these terms limits your rights under the Australian Consumer Law.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">12. Contact Information</h2>
            <p>
              If you have any questions regarding these Terms of Service, please contact our team at: 
              <a href="mailto:help@nestcrm.com.au" className="text-primary hover:underline mx-1">help@nestcrm.com.au</a>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
