import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router";
import SidebarDashboard from "../sidebar/SidebarDashboard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { formatPathToBreadcrumb } from "../../utils/helpers";
import { useUser } from "../../utils/hooks/userContext";
import { cn } from "@/lib/utils";
import {
  Search,
  Bell,
  Menu,
  Info,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Plus,
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
import { motion as Motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";

const LayoutDashboard = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { userData: user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const breadcrumbs = formatPathToBreadcrumb(pathname);
  const [scrolled, setScrolled] = useState(false);

  // Local state for search input to ensure smooth typing
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
  const debounceTimer = useRef(null);

  // Check if current page is Dashboard (exact match for /dashboard or /dashboard/)
  const isDashboard = pathname === "/dashboard" || pathname === "/dashboard/";

  // Update local state when URL changes
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
    }, 300);
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

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const { getDashboardActivities } =
        await import("../../utils/api/dashboardValue");
      await getDashboardActivities(
        (activities) => {
          if (activities) console.log("Activities fetched:", activities.length);
        },
        (notifs) => {
          setNotifications(notifs || []);
          setUnreadCount(notifs?.filter((n) => !n.is_read).length || 0);
        },
      );
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const { markAsRead } = await import("../../utils/api/dashboardValue");
      await markAsRead(id);
      fetchDashboardData();
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleNotificationClick = (notif) => {
    handleMarkAsRead(notif.id);
    if (user.role === "admin") {
      navigate(`/admin/pengajuan/${notif.id}`);
    } else {
      navigate(`/dashboard/${notif.id}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
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

  const logoutHandler = async () => {
    navigate("/");
    localStorage.removeItem("tokenKey");
    localStorage.removeItem("user");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (!user || Object.keys(user).length === 0) {
    // Redirect handled by ProtectedRoute, but safe check here
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-[#F4F7FE] overflow-hidden">
      {/* Sidebar - Fixed on Desktop */}
      <div className="hidden md:block w-[280px] shrink-0 bg-white h-full relative z-20">
        <SidebarDashboard />
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
          <Motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center min-w-0 overflow-hidden"
          >
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    <BreadcrumbItem className={index === breadcrumbs.length - 1 ? "" : "hidden md:flex"}>
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
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="hidden md:flex" />}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="hidden md:block text-2xl font-bold text-[#2B3674] capitalize mt-1">
              {breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard"}
            </h1>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 bg-white p-2.5 rounded-full shadow-sm shrink-0"
          >
            {/* Header Actions Portal Target */}
            <div id="header-actions" className="flex items-center gap-2"></div>

            {/* Search Pill - Conditionally Rendered */}
            {!isDashboard && (
              <div className="relative hidden md:block bg-[#F4F7FE] rounded-full px-4 py-2 mr-2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2B3674]" />
                <input
                  type="text"
                  placeholder="Cari..."
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
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
                <SidebarDashboard onClose={() => setIsSheetOpen(false)} />
              </SheetContent>
            </Sheet>

            {/* Buat Pengajuan Baru Button */}
            <Link to={"/dashboard/request"} className="hidden sm:block">
              <Button className="bg-[#4318FF] hover:bg-[#3311CC] text-white rounded-full px-5 py-2.5 text-sm font-bold shadow-[0_4px_14px_0_rgba(67,24,255,0.39)] hover:shadow-[0_6px_20px_rgba(67,24,255,0.23)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 whitespace-nowrap">
                <Plus className="h-4 w-4" />
                <span>Buat Pengajuan</span>
              </Button>
            </Link>

            {/* Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full text-gray-400 hover:text-[#4318FF] transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-2 w-2 shrink-0 rounded-full bg-red-500 ring-2 ring-white"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[350px] rounded-2xl shadow-xl border-none bg-white p-0 overflow-hidden font-bold"
              >
                <div className="bg-[#4318FF] px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-bold">
                      Notifications
                    </p>
                    <p className="text-white/70 text-[10px] uppercase tracking-wider font-medium">
                      You have {unreadCount} unread messages
                    </p>
                  </div>
                </div>
                <div className="max-h-[400px] overflow-y-auto p-2 no-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <DropdownMenuItem
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={cn(
                          "cursor-pointer flex flex-col items-start gap-1 rounded-xl px-4 py-3 mb-1 transition-all",
                          notif.is_read
                            ? "text-gray-400 focus:bg-gray-50"
                            : "text-[#2B3674] bg-blue-50/50 focus:bg-blue-50 border-l-4 border-[#4318FF]",
                        )}
                      >
                        <div className="flex justify-between w-full">
                          {user.role === "admin" && notif.type === "request" ? null : (
                            <span className="text-xs font-black uppercase tracking-wider">
                              {notif.request_type}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 font-medium">
                            {new Date(notif.time).toLocaleDateString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-sm font-bold leading-tight">
                          {user.role === "admin" && notif.type === "request"
                            ? `Request: ${notif.request_type}! ${notif.title}`
                            : notif.title}
                        </p>
                        {!notif.is_read && (
                          <span className="text-[10px] text-[#4318FF] font-bold mt-1">
                            Click to mark as read
                          </span>
                        )}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-gray-400 text-sm font-medium">
                        No notifications yet
                      </p>
                    </div>
                  )}
                </div>
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
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarImage
                      src={user.url_photo}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-blue-100 text-[#4318FF] font-bold text-xs">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-[#2B3674] leading-tight">
                      {user.full_name}
                    </p>
                    <p className="text-[10px] font-medium text-gray-400 uppercase">
                      {user.role}
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
                    User Account
                  </p>
                </div>
                <div className="p-2">
                  <DropdownMenuItem
                    className="cursor-pointer font-bold text-gray-600 focus:bg-indigo-50 focus:text-[#4318FF] rounded-xl px-4 py-2.5 transition-colors"
                    onClick={() => navigate("/dashboard/settings")}
                  >
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
          </Motion.div>
        </header>

        {/* Scrollable Content */}
        <Motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 p-4 lg:p-6 lg:pt-0 pb-20"
        >
          <Outlet
            context={{
              notifications,
              handleNotificationClick,
              user,
            }}
          />
        </Motion.main>
      </div>
    </div>
  );
};

export default LayoutDashboard;
