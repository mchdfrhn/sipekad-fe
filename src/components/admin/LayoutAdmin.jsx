import { Outlet, useLocation } from "react-router";
import SidebarAdmin from "../sidebar/SidebarAdmin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { formatPathToBreadcrumb } from "../../utils/helpers";
import { Search, Bell, Menu, Info, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const LayoutAdmin = () => {
  const { pathname } = useLocation();
  const breadcrumbs = formatPathToBreadcrumb(pathname);
  const [user, setUser] = useState({ name: "Admin", role: "admin" });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Logic for adding background when scrolled inside the main content
      const mainContent = document.getElementById("main-content-area");
      if (mainContent && mainContent.scrollTop > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const mainContent = document.getElementById("main-content-area");
    if (mainContent) {
      mainContent.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (mainContent) mainContent.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (user?.role !== "admin") {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800">Access Denied</h1>
        <p className="text-gray-500 mt-2">
          You do not have permission to view this page.
        </p>
        <Button className="mt-4" onClick={() => (window.location.href = "/")}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#F4F7FE] overflow-hidden">
      {/* Sidebar - Fixed on Desktop */}
      <div className="hidden md:block w-[280px] shrink-0 bg-white h-full relative z-20">
        <SidebarAdmin />
      </div>

      {/* Main Content Area */}
      <div
        id="main-content-area"
        className="flex flex-col flex-1 h-full overflow-y-auto no-scrollbar relative"
      >
        {/* Sticky Header */}
        <header
          className={`sticky top-0 z-30 flex items-center justify-between px-6 py-4 transition-all duration-300 ${
            scrolled
              ? "bg-white/80 backdrop-blur-md shadow-sm"
              : "bg-transparent"
          }`}
        >
          <div className="flex flex-col justify-center">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage className="text-sm font-bold text-[#2B3674] capitalize">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={crumb.path}
                          className="text-sm font-medium text-gray-500 hover:text-[#4318FF] capitalize"
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl font-bold text-[#2B3674] capitalize mt-1">
              {breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-white p-2.5 rounded-full shadow-sm">
            {/* Search Pill */}
            <div className="relative hidden md:block bg-[#F4F7FE] rounded-full px-4 py-2 mr-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2B3674]" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 bg-transparent border-none outline-none text-sm text-[#2B3674] placeholder-gray-400 w-40 focus:w-60 transition-all font-medium"
              />
            </div>

            {/* Mobile Sidebar Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 md:hidden rounded-full hover:bg-gray-100"
                >
                  <Menu className="h-5 w-5 text-gray-500" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 border-r-0">
                <SidebarAdmin />
              </SheetContent>
            </Sheet>

            {/* Notification Bell */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-400 hover:text-[#4318FF]"
            >
              <Bell className="h-5 w-5" />
            </Button>

            {/* Info Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-400 hover:text-[#4318FF]"
            >
              <Info className="h-5 w-5" />
            </Button>

            {/* Profile Pill */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer p-1 pr-4 hover:bg-gray-50 rounded-full transition-colors">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm bg-gray-100">
                    <AvatarImage src={user.photo} />
                    <AvatarFallback className="bg-gray-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-[#2B3674] leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[10px] font-medium text-gray-400 uppercase">
                      Admin
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[200px] rounded-xl shadow-xl border-none bg-white font-bold"
              >
                <DropdownMenuLabel className="font-bold text-[#2B3674]">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer font-medium text-gray-600 focus:text-[#4318FF]">
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer font-medium text-gray-600 focus:text-[#4318FF]">
                  Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 font-medium">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 p-4 lg:p-6 lg:pt-0 pb-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutAdmin;
