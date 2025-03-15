
import { Button } from "@/components/ui/button";

const SetupGuide = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Quick Setup Guide</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border border-border rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-primary font-semibold">1</span>
          </div>
          <h3 className="font-medium mb-2">Import Your Customers</h3>
          <p className="text-sm text-foreground/70 mb-4">
            Upload your customer data or connect your CRM system.
          </p>
          <Button variant="outline" size="sm">Import Data</Button>
        </div>
        
        <div className="p-4 border border-border rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-primary font-semibold">2</span>
          </div>
          <h3 className="font-medium mb-2">Configure AI Model</h3>
          <p className="text-sm text-foreground/70 mb-4">
            Set up the parameters for the churn prediction algorithm.
          </p>
          <Button variant="outline" size="sm">Configure</Button>
        </div>
        
        <div className="p-4 border border-border rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-primary font-semibold">3</span>
          </div>
          <h3 className="font-medium mb-2">Set Up Alerts</h3>
          <p className="text-sm text-foreground/70 mb-4">
            Choose how you want to be notified about at-risk customers.
          </p>
          <Button variant="outline" size="sm">Set Alerts</Button>
        </div>
      </div>
    </div>
  );
};

export default SetupGuide;
