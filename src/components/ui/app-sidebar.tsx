import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router";
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
import { cities, type CityProps } from "@/data/cities";
import { Home } from "lucide-react";

export function AppSidebar() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();
  const { cityName } = useParams<{ cityName: string }>();

  const selectedCityRef = useRef<HTMLLIElement | null>(null);

  const selectedCity = useMemo(() => {
    if (!cityName) return null;
    return cities.find((city) => city.url === `/cities/${cityName}`) ?? null;
  }, [cityName]);

  const filteredCities: CityProps[] = cities.filter((city) =>
    city.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedCityRef.current) {
        selectedCityRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [selectedCity]);

  return (
    <Sidebar>
      <SidebarContent>
        <div>
          <Link className="pl-5 pt-5 block" to="/">
            <Home />
          </Link>
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-md text-gray-900 transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>CITIES</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredCities.length > 0 ? (
                filteredCities.map((item) => {
                  const isSelected = selectedCity?.title === item.title;

                  return (
                    <SidebarMenuItem
                      key={item.title}
                      ref={isSelected ? selectedCityRef : null}
                    >
                      <SidebarMenuButton
                        onClick={() => navigate(item.url)}
                        className={`w-full text-left ${
                          isSelected
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              ) : (
                <div className="px-5 py-4 text-sm text-center text-gray-500">
                  No cities found.
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
