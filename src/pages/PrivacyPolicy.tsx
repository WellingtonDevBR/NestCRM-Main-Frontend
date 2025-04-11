
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, ArrowLeft, FileText, GlobeAustralia, Globe } from "lucide-react";
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
            
            <div className="bg-secondary/40 p-6 rounded-lg my-8 border border-border">
              <div className="flex items-center mb-4">
                <GlobeAustralia className="h-5 w-5 mr-2 text-primary" />
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
