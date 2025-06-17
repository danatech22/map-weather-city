import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>CITIES</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <span>{item.title}</span>
                    </a>
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

// Menu items.
const items = [
  {
    title: "Lagos",
    url: "/cities/lagos",
  },
  {
    title: "Tokyo",
    url: "/cities/tokyo",
  },
  {
    title: "Paris",
    url: "/cities/paris",
  },
  {
    title: "New York City",
    url: "/cities/new-york-city",
  },
  {
    title: "London",
    url: "/cities/london",
  },
  {
    title: "Dubai",
    url: "/cities/dubai",
  },
  {
    title: "Sydney",
    url: "/cities/sydney",
  },
  {
    title: "Rio de Janeiro",
    url: "/cities/rio-de-janeiro",
  },
  {
    title: "Cairo",
    url: "/cities/cairo",
  },
  {
    title: "Mumbai",
    url: "/cities/mumbai",
  },
  {
    title: "Berlin",
    url: "/cities/berlin",
  },
  {
    title: "Cape Town",
    url: "/cities/cape-town",
  },
  {
    title: "Toronto",
    url: "/cities/toronto",
  },
  {
    title: "Rome",
    url: "/cities/rome",
  },
  {
    title: "Beijing",
    url: "/cities/beijing",
  },
  {
    title: "Mexico City",
    url: "/cities/mexico-city",
  },
  {
    title: "Moscow",
    url: "/cities/moscow",
  },
  {
    title: "Istanbul",
    url: "/cities/istanbul",
  },
  {
    title: "Buenos Aires",
    url: "/cities/buenos-aires",
  },
  {
    title: "Seoul",
    url: "/cities/seoul",
  },
  {
    title: "Amsterdam",
    url: "/cities/amsterdam",
  },
];
