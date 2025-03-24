
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getSubdomain } from "@/utils/subdomain";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Settings,
  HelpCircle,
  FileText,
  ChartBar,
  User,
  LogOut,
  PanelLeft,
  ShoppingCart,
  CreditCard,
  LifeBuoy
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar
} from "@/components/ui/sidebar";
import { logout } from "@/utils/api";
import { Button } from "@/components/ui/button";

// Separate component for the sidebar toggle button
export const SidebarToggleButton: React.FC = () => {
  const { toggleSidebar, state } = useSidebar();
  
  return (
    <Button 
      variant="outline" 
      size="icon"
      className="fixed top-4 left-4 z-50 shadow-md bg-white border-gray-200 hover:bg-gray-100"
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

const DashboardSidebar: React.FC = () => {
  const subdomain = getSubdomain();
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();

  // Handle logout click
  const handleLogout = async () => {
    await logout();
    // The logout function already handles the redirect
  };

  // Main navigation items
  const mainNavItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Customers", icon: Users, path: "/customers" },
    { title: "Orders", icon: ShoppingCart, path: "/orders" },
    { title: "Payments", icon: CreditCard, path: "/payments" },
    { title: "Interactions", icon: MessageSquare, path: "/interactions" },
    { title: "Support", icon: LifeBuoy, path: "/support" },
    { title: "Predictions", icon: TrendingUp, path: "/predictions" },
    { title: "Risk Alerts", icon: AlertTriangle, path: "/risk-alerts" },
    { title: "Analytics", icon: ChartBar, path: "/analytics" },
  ];

  // Secondary navigation items
  const secondaryNavItems = [
    { title: "Reports", icon: FileText, path: "/reports" },
    { title: "Settings", icon: Settings, path: "/settings" },
    { title: "Help & Support", icon: HelpCircle, path: "/support" },
  ];

  // Check if the current path is or starts with a specific path
  const isPathActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <Sidebar className="border-r border-purple-100" data-sidebar="sidebar">
      <SidebarHeader className="py-4">
        <div className="px-2 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-400 text-white font-bold">
              N
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
              NestCRM
            </span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-1"
            onClick={toggleSidebar}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="px-4 mt-4">
          <div className="group flex flex-col">
            <div className="text-xs text-muted-foreground">Company</div>
            <div className="font-medium">{subdomain || "Demo Company"}</div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={isPathActive(item.path)}
                  >
                    <Link to={item.path}>
                      <item.icon className={isPathActive(item.path) ? "text-purple-700" : "text-purple-500"} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={isPathActive(item.path)}
                  >
                    <Link to={item.path}>
                      <item.icon className={isPathActive(item.path) ? "text-purple-700" : "text-purple-500"} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="flex flex-col gap-3 px-3 py-3">
              <Link to="/profile" className="flex items-center gap-3 rounded-md hover:bg-purple-50 transition-colors py-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <User size={16} className="text-purple-700" />
                </div>
                <div>
                  <div className="text-sm font-medium">Admin User</div>
                  <div className="text-xs text-muted-foreground">View Profile</div>
                </div>
              </Link>
              
              <Button 
                variant="ghost" 
                className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                <span>Logout</span>
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
