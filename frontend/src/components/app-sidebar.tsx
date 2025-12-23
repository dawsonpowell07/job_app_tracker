"use client";

import * as React from "react";
import {
  LayoutGrid,
  FileText,
  MessageSquare,
  GraduationCap,
  Home,
} from "lucide-react";
import { useUser, UserButton } from "@clerk/clerk-react";
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
      url: "/applications/cards",
      icon: LayoutGrid,
      isActive: true,
      items: [
        {
          title: "Card View",
          url: "/applications/cards",
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
        {
          title: "Kanban View",
          url: "/applications/kanban",
        },
      ],
    },
    {
      title: "Resumes",
      url: "/resumes/my-resumes",
      icon: FileText,
      items: [
        {
          title: "My Resumes",
          url: "/resumes/my-resumes",
        },
        {
          title: "Create Resume",
          url: "/resumes/create",
        },
      ],
    },
    {
      title: "Chat",
      url: "/chat",
      icon: MessageSquare,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              to="/"
              className="flex items-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:px-2 hover:opacity-70 transition-opacity"
            >
              <GraduationCap className="w-5 h-5 text-[#134074] shrink-0" />
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
                  name:
                    user.fullName ||
                    user.primaryEmailAddress?.emailAddress ||
                    "User",
                  email: user.primaryEmailAddress?.emailAddress || "",
                  avatar: user.imageUrl || "",
                }
              : {
                name: "User",
                email: "",
                avatar: "",
              }
          }
        />
        <UserButton afterSignOutUrl="/" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
