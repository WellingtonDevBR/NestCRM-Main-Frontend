
import React from "react";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export const SidebarToggleButton: React.FC = () => {
  const { toggleSidebar, state } = useSidebar();
  
  return (
    <Button 
      variant="outline" 
      size="icon"
      className="fixed top-4 left-4 z-50 shadow-md bg-background border-border dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      onClick={toggleSidebar}
      style={{ 
        opacity: state === 'collapsed' ? 1 : 0,
        pointerEvents: state === 'collapsed' ? 'auto' : 'none',
        transition: 'opacity 0.2s ease-in-out'
      }}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};
