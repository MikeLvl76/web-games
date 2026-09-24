import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Heart, Home, LucideIcon, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SidebarItem = {
  title?: string;
  url: string;
  icon: LucideIcon;
};

const items: SidebarItem[] = [
  { url: "/", icon: Home },
  { title: "My games", url: "/favorite-games", icon: Heart },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-none shadow-2xl/50 bg-black/80 fixed z-50">
      <SidebarContent className="w-full h-full">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, i) => (
                <SidebarMenuItem
                  key={item.title ?? i}
                  className="flex w-[99%] h-[8vh] items-center hover:bg-black/20 rounded-md p-2"
                >
                  <SidebarMenuButton size="lg" asChild>
                    <Link
                      href={item.url}
                      className="flex flex-row items-baseline justify-between"
                    >
                      {item.title && (
                        <span className="text-sm font-bold text-center text-slate-200">
                          {item.title}
                        </span>
                      )}
                      {i === 0 ? (
                        <Image
                          src="/images/logo.png"
                          alt="Logo"
                          width={92}
                          height={92}
                          className="w-auto h-auto"
                        />
                      ) : (
                        <item.icon
                          color="white"
                          className="!size-6"
                        />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
