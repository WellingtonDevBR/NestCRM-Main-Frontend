
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Cookie, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CookiePolicy = () => {
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
              <Cookie className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Cookie Policy</h1>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground">Effective Date: 06 April 2025</p>
            
            <p>
              This Cookie Policy explains how Nest CRM Pty Ltd ("Nest CRM", "we", "our", or "us") 
              uses cookies and similar technologies to recognize you when you visit our website and 
              use our services. It explains what these technologies are, why we use them, and your 
              rights to control their use.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your browser or device by websites you visit. 
              They help websites function properly, improve user experience, and collect information for 
              analytics and personalization.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">2. Types of Cookies We Use</h2>
            <p>Nest CRM uses the following categories of cookies:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Strictly Necessary Cookies:</span> Required for the platform 
                to function (e.g., authentication tokens)
              </li>
              <li>
                <span className="font-medium">Performance Cookies:</span> Help us understand how users 
                interact with the platform
              </li>
              <li>
                <span className="font-medium">Functional Cookies:</span> Remember your preferences 
                (e.g., theme settings)
              </li>
              <li>
                <span className="font-medium">Analytics Cookies:</span> Track usage data to improve 
                features and performance
              </li>
            </ul>
            <p>We do not use cookies for advertising or behavioral profiling.</p>
            
            <h2 className="text-xl font-semibold mt-8">3. Why We Use Cookies</h2>
            <p>We use cookies to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Authenticate and maintain your login session</li>
              <li>Save your user preferences and dashboard configuration</li>
              <li>Analyze platform usage to improve services</li>
              <li>Enhance security and fraud prevention</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8">4. Managing and Controlling Cookies</h2>
            <p>
              You can control or disable cookies through your browser settings. Please note that disabling 
              certain cookies may affect functionality or access to features of Nest CRM.
            </p>
            <p>For more information, visit:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <a 
                  href="https://support.google.com/chrome/answer/95647" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Chrome: Managing cookies in Chrome
                </a>
              </li>
              <li>
                <a 
                  href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Firefox: Enable and disable cookies
                </a>
              </li>
              <li>
                <a 
                  href="https://support.apple.com/en-au/guide/safari/sfri11471/mac" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Safari: Managing cookies and website data
                </a>
              </li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8">5. Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. Material changes will be communicated 
              via our website. Continued use of our services indicates your consent to the use of cookies 
              under this policy.
            </p>
            
            <h2 className="text-xl font-semibold mt-8">6. Contact Us</h2>
            <p>
              If you have any questions about this Cookie Policy, please contact us at:
            </p>
            <p>
              Email: <a href="mailto:info@nestcrm.com.au" className="text-primary hover:underline">info@nestcrm.com.au</a>
            </p>
            <p>
              Postal Address: Level 12, 100 King William Street, Adelaide, South Australia 5000
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CookiePolicy;
