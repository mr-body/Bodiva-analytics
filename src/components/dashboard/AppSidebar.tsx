import {
    Home,
    BarChart3,
    Wallet,
    Coins,
    Briefcase,
    Eye,
    Brain,
    Settings,
    LifeBuoy,
    ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/assets/logo.png"

const main = [
    { label: "Home", icon: Home },
    { label: "Markets", icon: BarChart3, active: true },
    { label: "Smart Money", icon: Wallet },
    { label: "Token", icon: Coins },
    { label: "Portfolio", icon: Briefcase },
    { label: "Watchlists", icon: Eye },
];

const intelligence = ["Alert", "Research", "API"];

export function AppSidebar() {
    const { state } = useSidebar();
    const collapsed = state === "collapsed";

    return (
        <Sidebar collapsible="icon" className="border-border">
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-1">
                    <img src={logo} alt="Logo" width={20} height={20} />
                    {!collapsed && <span className="text-xs font-bold tracking-tight">Budiva Analytics</span>}
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {main.map(({ label, icon: Icon, active }) => (
                                <SidebarMenuItem key={label}>
                                    <SidebarMenuButton tooltip={label} isActive={active ?? false}>
                                        <Icon className="size-4" />
                                        <span>{label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>
                        <Brain className="mr-2 size-4" />
                        Intelligence
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuSub>
                                    {intelligence.map((item, i) => (
                                        <SidebarMenuSubItem key={item}>
                                            <SidebarMenuSubButton isActive={i === 0}>
                                                <span>{item}</span>
                                                <ChevronDown className="ml-auto size-4 opacity-60" />
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-auto">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip="Setting">
                                    <Settings className="size-4" />
                                    <span>Setting</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip="Support">
                                    <LifeBuoy className="size-4" />
                                    <span>Support</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                {!collapsed && (
                    <div className="rounded-xl border border-sidebar-border bg-surface p-4 text-center">
                        <div className="mx-auto mb-3 h-20 w-full rounded-lg bg-gradient-to-br from-accent to-secondary" />
                        <p className="text-sm font-semibold">Pro plan</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Real-time on-chain intelligence for smarter trading
                        </p>
                        <Button className="mt-3 w-full" size="sm">
                            Manage plan
                        </Button>
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
