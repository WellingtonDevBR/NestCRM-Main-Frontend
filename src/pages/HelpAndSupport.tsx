
import React, { useState } from "react";
import { useFaqs, useKnowledgeBase, useContactMethods } from "@/hooks/useHelpAndSupport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, HelpCircle } from "lucide-react";
import FaqAccordion from "@/components/help-support/FaqAccordion";
import KnowledgeBaseCard from "@/components/help-support/KnowledgeBaseCard";
import ContactMethodCard from "@/components/help-support/ContactMethodCard";

const HelpAndSupport: React.FC = () => {
  // States and hooks
  const { faqs, faqsByCategory, isLoading: isLoadingFaqs } = useFaqs();
  const { articles, isLoading: isLoadingArticles } = useKnowledgeBase();
  const { contactMethods, isLoading: isLoadingContacts } = useContactMethods();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("faqs");

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter knowledge base articles based on search query
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Loading states
  if (isLoadingFaqs && isLoadingArticles && isLoadingContacts) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Help & Support</h1>
      </div>
      
      {/* Search section */}
      <Card className="bg-purple-50 border-purple-100">
        <CardContent className="p-6">
          <div className="text-center max-w-2xl mx-auto">
            <HelpCircle className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">How can we help you?</h2>
            <p className="text-muted-foreground mb-6">
              Search our knowledge base, FAQs, or contact our support team
            </p>
            <div className="flex w-full max-w-lg mx-auto">
              <Input
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none focus-visible:ring-purple-400"
              />
              <Button className="rounded-l-none">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Main content with tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Support Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="faqs" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="faqs">Frequently Asked Questions</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
              <TabsTrigger value="contact">Contact Us</TabsTrigger>
            </TabsList>
            
            {/* FAQs Tab */}
            <TabsContent value="faqs" className="mt-6">
              {searchQuery ? (
                <div>
                  <h3 className="text-lg font-medium mb-4">Search Results ({filteredFaqs.length})</h3>
                  {filteredFaqs.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFaqs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pt-2 pb-1 text-muted-foreground">
                              {faq.answer}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-12">
                      <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-1">No FAQs found</h3>
                      <p className="text-muted-foreground mb-4">
                        Try a different search term or check the knowledge base
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <FaqAccordion 
                    faqs={faqsByCategory.account} 
                    categoryTitle="Account & User Management" 
                  />
                  <FaqAccordion 
                    faqs={faqsByCategory.billing} 
                    categoryTitle="Billing & Subscriptions" 
                  />
                  <FaqAccordion 
                    faqs={faqsByCategory.features} 
                    categoryTitle="Features & Usage" 
                  />
                  <FaqAccordion 
                    faqs={faqsByCategory.technical} 
                    categoryTitle="Technical Support" 
                  />
                  <FaqAccordion 
                    faqs={faqsByCategory.general} 
                    categoryTitle="General Information" 
                  />
                </div>
              )}
            </TabsContent>
            
            {/* Knowledge Base Tab */}
            <TabsContent value="knowledge" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(searchQuery ? filteredArticles : articles).map(article => (
                  <KnowledgeBaseCard key={article.id} article={article} />
                ))}
                {(searchQuery ? filteredArticles : articles).length === 0 && (
                  <div className="col-span-2 text-center py-12">
                    <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-1">No articles found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try a different search term or check the FAQs
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Contact Us Tab */}
            <TabsContent value="contact" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {contactMethods.map(method => (
                  <ContactMethodCard key={method.id} contactMethod={method} />
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <Input id="name" placeholder="Your name" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input id="email" type="email" placeholder="Your email" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input id="subject" placeholder="Subject of your message" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>
                    <Button className="w-full md:w-auto">
                      Submit Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Add missing imports
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default HelpAndSupport;
