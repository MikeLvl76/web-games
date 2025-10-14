import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Heart, Home, LucideIcon } from "lucide-react";
import Link from "next/link";

type SidebarItem = {
  title?: string;
  url: string;
  icon: LucideIcon;
};

const items: SidebarItem[] = [
  { url: "/", icon: Home },
  { title: "Favorite games", url: "/favorite-games", icon: Heart },
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
                  className="flex w-full h-[10vh] items-center hover:bg-black/50"
                >
                  <SidebarMenuButton size="lg" asChild>
                    <Link
                      href={item.url}
                      className="flex flex-row items-center justify-between"
                    >
                      <item.icon size={i === 0 ? 64 : 32} color="white" />
                      {item.title && (
                        <span className="text-lg font-bold text-center text-white">
                          {item.title}
                        </span>
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
