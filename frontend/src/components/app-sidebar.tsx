"use client";

import * as React from "react";
import {
  LayoutGrid,
  FileText,
  MessageSquare,
  Circle,
  Home,
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Applications",
      url: "/applications/bento-box",
      icon: LayoutGrid,
      isActive: true,
      items: [
        {
          title: "Bento Box View",
          url: "/applications/bento-box",
        },
        {
          title: "Timeline View",
          url: "/applications/timeline",
        },
        {
          title: "Excel View",
          url: "/applications/excel",
        },
        {
          title: "Bucket View",
          url: "/applications/bucket",
        },
      ],
    },
    {
      title: "Resumes",
      url: "/resumes",
      icon: FileText,
    },
    {
      title: "Chat",
      url: "/chat",
      icon: MessageSquare,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth0();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              to="/"
              className="flex items-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:px-2 hover:opacity-70 transition-opacity"
            >
              <Circle
                className="w-2 h-2 text-pink-400 shrink-0"
                fill="currentColor"
              />
              <span className="font-handwritten text-base group-data-[collapsible=icon]:hidden">
                ApplyFlow
              </span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="justify-center">
        <ModeToggle />
        <NavUser
          user={
            user
              ? {
                  name: user.name || user.email || "User",
                  email: user.email || "",
                  avatar: user.picture || "",
                }
              : {
                  name: "User",
                  email: "",
                  avatar: "",
                }
          }
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
