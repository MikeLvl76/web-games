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
import Image from "next/image";
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
                  className="flex w-full h-[10vh] items-center hover:bg-black/20 rounded-md"
                >
                  <SidebarMenuButton size="lg" asChild>
                    <Link
                      href={item.url}
                      className="flex flex-row items-center justify-around"
                    >
                      {i === 0 ? (
                        <Image
                          src="/images/logo.png"
                          alt="Logo"
                          width={92}
                          height={92}
                        />
                      ) : (
                        <item.icon
                          color="white"
                          fill="white"
                          className="!size-10"
                        />
                      )}

                      {item.title && (
                        <span className="text-md font-bold text-center text-white">
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
