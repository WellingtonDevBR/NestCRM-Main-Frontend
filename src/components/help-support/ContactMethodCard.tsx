
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ContactMethod } from "@/domain/models/helpAndSupport";
import { Mail, Phone, MessageSquare } from "lucide-react";

interface ContactMethodCardProps {
  contactMethod: ContactMethod;
}

const ContactMethodCard: React.FC<ContactMethodCardProps> = ({ contactMethod }) => {
  // Get icon based on contact method type
  const getIcon = () => {
    switch (contactMethod.type) {
      case "email":
        return <Mail className="h-8 w-8 text-purple-500" />;
      case "phone":
        return <Phone className="h-8 w-8 text-green-500" />;
      case "chat":
        return <MessageSquare className="h-8 w-8 text-blue-500" />;
      default:
        return <Mail className="h-8 w-8 text-purple-500" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div>{getIcon()}</div>
          <div>
            <h3 className="text-lg font-medium">
              {contactMethod.type === "email" && "Email Support"}
              {contactMethod.type === "phone" && "Phone Support"}
              {contactMethod.type === "chat" && "Live Chat"}
            </h3>
            <p className="text-sm text-muted-foreground mb-1">{contactMethod.description}</p>
            <div className="text-purple-600 font-medium">{contactMethod.value}</div>
            {contactMethod.availableHours && (
              <div className="text-xs text-muted-foreground mt-2">
                Available: {contactMethod.availableHours}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactMethodCard;
