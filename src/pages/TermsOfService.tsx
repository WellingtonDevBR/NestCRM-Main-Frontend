
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
            <p className="text-muted-foreground">Effective Date: 06 April 2025</p>
            
            <h2 className="text-xl font-semibold mt-8">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Nest CRM service, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">2. Description of Service</h2>
            <p>
              Nest CRM provides an AI-powered customer retention platform designed to help businesses 
              predict and prevent customer churn. Our service includes data analysis, customer insights, 
              and retention strategy tools.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">3. User Accounts</h2>
            <p>
              To access certain features of our service, you must create a user account. You are 
              responsible for maintaining the confidentiality of your account information and for all 
              activities that occur under your account.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">4. Privacy and Data Protection</h2>
            <p>
              Our collection and use of personal information is governed by our 
              <Link to="/privacy-policy" className="text-primary hover:underline mx-1">
                Privacy Policy
              </Link>. 
              By using Nest CRM, you acknowledge and agree to the collection and use of your 
              information as described therein.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">5. Subscription and Payment</h2>
            <p>
              Access to Nest CRM requires a paid subscription. Subscription fees are billed in advance 
              on a monthly or annual basis. All payments are non-refundable except as required by law.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">6. User Content</h2>
            <p>
              You retain all rights to any content you submit or upload to Nest CRM. By submitting 
              content, you grant Nest CRM a worldwide, non-exclusive license to use, store, and process 
              this content for the purpose of providing our services.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Nest CRM shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages arising out of or relating to your 
              use of our service.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">8. Changes to Terms</h2>
            <p>
              Nest CRM reserves the right to modify these Terms of Service at any time. We will notify 
              users of any material changes through our website or via email.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">9. Termination</h2>
            <p>
              We reserve the right to terminate or suspend access to our service immediately, without 
              prior notice or liability, for any reason including breach of these Terms of Service.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">10. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by the laws of Australia. Any disputes arising 
              under these terms shall be subject to the exclusive jurisdiction of the courts of Australia.
            </p>
            
            <div className="mt-10 mb-6">
              <p className="font-semibold">Contact Information</p>
              <p>
                For questions about these Terms of Service, please contact us at:
                <a href="mailto:info@nestcrm.com.au" className="text-primary hover:underline mx-1">
                  info@nestcrm.com.au
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
