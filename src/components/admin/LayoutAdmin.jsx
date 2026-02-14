import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router";
import SidebarAdmin from "../sidebar/SidebarAdmin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  formatPathToBreadcrumb,
  formatDateRelative,
} from "../../utils/helpers";
import {
  getDashboardActivities,
  markAsRead,
} from "../../utils/api/dashboardValue";
import {
  Search,
  Bell,
  Menu,
  Info,
  User,
  Settings,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";
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
import { useState, useEffect, useRef } from "react";
import Alert from "../ui/Alert";

const LayoutAdmin = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const breadcrumbs = formatPathToBreadcrumb(pathname);
  const [user, setUser] = useState({
    full_name: "Admin",
    role: "admin",
    url_photo: "",
  });
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Local state for search input to ensure smooth typing
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
  const debounceTimer = useRef(null);

  // Check if current page is Dashboard (exact match for /admin or /admin/)
  const isDashboard = pathname === "/admin" || pathname === "/admin/";

  // Update local state when URL changes (e.g., navigating between pages or back/forward)
  useEffect(() => {
    setSearchValue(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for debounced URL update
    debounceTimer.current = setTimeout(() => {
      const newParams = new URLSearchParams(window.location.search);
      if (value) {
        newParams.set("q", value);
      } else {
        newParams.delete("q");
      }
      setSearchParams(newParams, { replace: true });
    }, 300); // 300ms debounce
  };

  const clearSearch = () => {
    setSearchValue("");
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    const newParams = new URLSearchParams(window.location.search);
    newParams.delete("q");
    setSearchParams(newParams, { replace: true });
  };

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
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Initial fetch of notifications
    getDashboardActivities(null, setNotifications);

    // Refresh notifications every minute
    const interval = setInterval(() => {
      getDashboardActivities(null, setNotifications);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      try {
        await markAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n)),
        );
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    }
    navigate(`/admin/pengajuan/${notif.id}`);
  };

  const logoutHandler = async () => {
    const token = localStorage.getItem("tokenKey");

    if (token) {
      navigate("/");
      localStorage.removeItem("tokenKey");
      localStorage.removeItem("user");
    }
  };

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
              {breadcrumbs[breadcrumbs.length - 1]?.label === "Admin"
                ? "Dashboard"
                : breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-white p-2.5 rounded-full shadow-sm">
            {/* Header Actions Portal Target */}
            <div id="header-actions"></div>

            {/* Search Pill - Conditionally Rendered */}
            {!isDashboard && (
              <div className="relative hidden md:block bg-[#F4F7FE] rounded-full px-4 py-2 mr-2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2B3674]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="pl-8 bg-transparent border-none outline-none text-sm text-[#2B3674] placeholder-gray-400 w-40 focus:w-60 transition-all font-medium"
                />
                {searchValue && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            )}

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

            {/* Notification Bell with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full text-gray-400 hover:text-[#4318FF] transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[350px] rounded-2xl shadow-xl border-none bg-white p-0 overflow-hidden z-[9999]"
              >
                <div className="bg-[#4318FF] px-6 py-4 flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/30">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <div className="max-h-[400px] overflow-y-auto no-scrollbar py-2">
                  {notifications.length > 0 ? (
                    notifications.map((notif, idx) => (
                      <DropdownMenuItem
                        key={idx}
                        className={`px-6 py-4 cursor-pointer focus:bg-gray-50 flex flex-col items-start gap-1 transition-colors relative ${
                          !notif.is_read ? "bg-blue-50/50" : ""
                        }`}
                        onClick={() => handleNotificationClick(notif)}
                      >
                        {!notif.is_read && (
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#4318FF] rounded-full" />
                        )}
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold text-[#4318FF] uppercase tracking-wider">
                            {notif.request_type}
                          </span>
                          <span className="text-[10px] font-medium text-gray-400">
                            {formatDateRelative(notif.time)}
                          </span>
                        </div>
                        <p
                          className={`text-sm ${!notif.is_read ? "font-bold text-[#2B3674]" : "font-medium text-gray-500"}`}
                        >
                          {notif.title}
                        </p>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                      <Bell className="h-10 w-10 mb-3 opacity-20" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="border-t border-gray-100 p-3 bg-gray-50/50">
                    <Button
                      variant="ghost"
                      className="w-full text-[#4318FF] hover:text-[#4318FF] hover:bg-blue-50 text-xs font-bold rounded-xl"
                      onClick={() => navigate("/admin/pengajuan")}
                    >
                      View All Notifications
                    </Button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

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
                    <AvatarImage src={user.url_photo} />
                    <AvatarFallback className="bg-gray-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-[#2B3674] leading-tight">
                      {user.full_name}
                    </p>
                    <p className="text-[10px] font-medium text-gray-400 uppercase">
                      Admin
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[220px] rounded-2xl shadow-xl border-none bg-white p-0 overflow-hidden font-bold"
              >
                <div className="bg-[#4318FF] px-6 py-4 flex flex-col gap-0.5">
                  <p className="text-white text-sm font-bold truncate">
                    {user.full_name}
                  </p>
                  <p className="text-white/70 text-[10px] uppercase tracking-wider font-medium">
                    Administrator
                  </p>
                </div>
                <div className="p-2">
                  <DropdownMenuItem className="cursor-pointer font-bold text-gray-600 focus:bg-indigo-50 focus:text-[#4318FF] rounded-xl px-4 py-2.5 transition-colors">
                    <Settings className="mr-3 h-4 w-4 text-gray-400 group-focus:text-[#4318FF]" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <a
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <DropdownMenuItem className="cursor-pointer font-bold text-gray-600 focus:bg-indigo-50 focus:text-[#4318FF] rounded-xl px-4 py-2.5 transition-colors">
                      <HelpCircle className="mr-3 h-4 w-4 text-gray-400 group-focus:text-[#4318FF]" />
                      <span>Contact Support</span>
                    </DropdownMenuItem>
                  </a>
                  <DropdownMenuSeparator className="my-1 bg-gray-100" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-500 hover:text-white hover:bg-red-500 focus:bg-red-500 focus:text-white font-bold transition-all rounded-xl px-4 py-2.5"
                    onClick={logoutHandler}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 p-4 lg:p-6 lg:pt-0 pb-20">
          <Outlet
            context={{
              notifications,
              setNotifications,
              handleNotificationClick,
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default LayoutAdmin;
