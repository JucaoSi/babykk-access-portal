import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Eye, 
  ShoppingCart, 
  Star,
  LogOut,
  User,
  Trophy
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  username: string;
  current_tier: number;
  total_invites: number;
  user_id: string;
}

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [profile, setProfile] = useState<Profile | null>(null);
  const collapsed = state === 'collapsed';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(profileData);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleBuyClick = () => {
    window.open('https://t.me/babykk001', '_blank');
  };

  const mainItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Free Preview", url: "/preview", icon: Eye },
  ];

  const tierItems = [
    { 
      title: "Tier 1", 
      url: "/tier/1", 
      icon: Star,
      subtitle: "$50 or 50 invites",
      content: "4,500+ Videos (7-14 Years)",
      unlocked: profile ? profile.current_tier >= 1 : false
    },
    { 
      title: "Tier 2", 
      url: "/tier/2", 
      icon: Star,
      subtitle: "$90 or 100 invites",
      content: "20,000+ Videos (5-17 Years)",
      unlocked: profile ? profile.current_tier >= 2 : false
    },
    { 
      title: "Tier 3", 
      url: "/tier/3", 
      icon: Star,
      subtitle: "$120 or 250 invites",
      content: "100,000+ Videos (5-14 Years)",
      unlocked: profile ? profile.current_tier >= 3 : false
    },
    { 
      title: "Tier 4", 
      url: "/tier/4", 
      icon: Star,
      subtitle: "$250 or 350 invites",
      content: "190,000+ Videos (3-17 Years)",
      unlocked: profile ? profile.current_tier >= 4 : false
    },
    { 
      title: "Tier 5", 
      url: "/tier/5", 
      icon: Star,
      subtitle: "$350 or 500 invites",
      content: "300,000+ Videos (1-17 Years)",
      unlocked: profile ? profile.current_tier >= 5 : false
    },
    { 
      title: "Tier 6", 
      url: "/tier/6", 
      icon: Star,
      subtitle: "$450 or 600 invites",
      content: "780,000+ Videos (0-17 Years)",
      unlocked: profile ? profile.current_tier >= 6 : false
    },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-72"} bg-card border-r border-border/50`}>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">BK</span>
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                BabyKK
              </h2>
              <p className="text-xs text-muted-foreground">Access Portal</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* User Profile Section */}
        {!collapsed && profile && (
          <div className="mx-2 mb-4 p-3 rounded-lg bg-muted/30 border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">{profile.username}</span>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>ID:</span>
                <span className="font-mono">{profile.user_id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span>Current Tier:</span>
                <span className="text-primary font-medium">{profile.current_tier}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Invites:</span>
                <span className="text-primary font-medium">{profile.total_invites}</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`${isActive(item.url) 
                      ? "bg-primary/10 text-primary border-primary/20" 
                      : "hover:bg-accent/10"
                    } transition-colors`}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleBuyClick}
                  className="hover:bg-accent/10 transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {!collapsed && <span>Buy</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tiers */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            Content Tiers
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tierItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`${isActive(item.url) 
                      ? "bg-primary/10 text-primary border-primary/20" 
                      : item.unlocked 
                        ? "hover:bg-accent/10" 
                        : "opacity-50 cursor-not-allowed"
                    } transition-colors`}
                  >
                    <Link 
                      to={item.unlocked ? item.url : "#"} 
                      className={`flex items-center gap-3 ${!item.unlocked ? "pointer-events-none" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        {item.unlocked ? (
                          <Trophy className="h-4 w-4 text-primary" />
                        ) : (
                          <item.icon className="h-4 w-4" />
                        )}
                        {!collapsed && (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{item.title}</span>
                            <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sign Out */}
        <div className="mt-auto p-2">
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="w-full border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}