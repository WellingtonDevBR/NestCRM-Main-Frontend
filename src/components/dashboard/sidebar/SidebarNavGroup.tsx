
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";

export interface NavItem {
  title: string;
  icon: LucideIcon;
  path: string;
}

interface SidebarNavGroupProps {
  label: string;
  items: NavItem[];
}

export const SidebarNavGroup: React.FC<SidebarNavGroupProps> = ({ label, items }) => {
  const location = useLocation();
  
  // Check if the current path is or starts with a specific path
  const isPathActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
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
  );
};
