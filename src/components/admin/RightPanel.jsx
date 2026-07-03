import {
  Bell,
  User,
  Info,
  Briefcase,
  ExternalLink,
  InboxIcon,
  ActivityIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getDashboardActivities } from "../../utils/api/dashboardValue";
import { formatDateRelative } from "../../utils/helpers";
import { Link, useOutletContext } from "react-router";

const NotificationItem = ({
  title,
  request_type,
  time,
  variant = "blue",
  onClick,
  is_read,
}) => {
  const bgColors = {
    blue: "bg-blue-50 text-blue-500",
    green: "bg-green-50 text-green-500",
    red: "bg-red-50 text-red-500",
    purple: "bg-purple-50 text-purple-500",
  };

  return (
    <div
      onClick={onClick}
      className={`relative flex items-start gap-4 mb-4 last:mb-0 group p-3 rounded-xl transition-colors cursor-pointer ${
        !is_read
          ? "bg-blue-50 hover:bg-blue-100/70"
          : "bg-white hover:bg-gray-50"
      }`}
    >
      {/* Left accent bar for unread */}
      {!is_read && (
        <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#4318FF] rounded-full" />
      )}

      <div className={`p-2 rounded-xl shrink-0 ${bgColors[variant]}`}>
        <Bell className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <h4
          className={`text-sm transition-colors ${
            !is_read
              ? "font-bold text-[#2B3674] group-hover:text-[#4318FF]"
              : "font-medium text-gray-500 group-hover:text-[#4318FF]"
          }`}
        >
          {title.startsWith("from ") ? (
            <>
              Request: <span className="font-bold">{request_type}</span>!{" "}
              {title}
            </>
          ) : (
            <>
              {title}{" "}
              <span className={!is_read ? "text-[#4318FF]" : "text-gray-400"}>
                {request_type}
              </span>
            </>
          )}
        </h4>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <ExternalLink className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

// Gradient colors for avatar fallback by initial
const GRADIENT_PALETTE = [
  "from-[#4318FF] to-[#7C5FFF]",
  "from-[#059669] to-[#34d399]",
  "from-[#D97706] to-[#fbbf24]",
  "from-[#DC2626] to-[#f87171]",
  "from-[#A855F7] to-[#c084fc]",
  "from-[#0ea5e9] to-[#38bdf8]",
];

const getGradient = (name) => {
  const initial = (name || "U").charCodeAt(0);
  return GRADIENT_PALETTE[initial % GRADIENT_PALETTE.length];
};

const ActivityItem = ({
  admin_name,
  requester_name,
  request_type,
  status,
  time,
  image,
  type,
}) => {
  const statusColors = {
    sukses: "text-[#4318FF]",
    complete: "text-[#4318FF]",
    completed: "text-[#4318FF]",
    ditolak: "text-[#718096]",
    canceled: "text-[#718096]",
    cancel: "text-[#718096]",
    diproses: "text-orange-500",
    proses: "text-orange-500",
    pending: "text-gray-400",
  };

  const statusLabel = status?.toLowerCase() || "";
  const colorClass = statusColors[statusLabel] || "text-blue-500";

  const translateStatus = (s) => {
    switch (s?.toLowerCase()) {
      case "completed":
      case "sukses":
        return "Selesai";
      case "canceled":
      case "ditolak":
        return "Ditolak";
      case "pending":
        return "Pending";
      case "proses":
      case "diproses":
        return "Diproses";
      default:
        return s;
    }
  };

  const displayName = admin_name || requester_name || "U";
  const initial = displayName.charAt(0).toUpperCase();
  const gradient = getGradient(displayName);

  return (
    <div className="flex items-center gap-4 mb-5 last:mb-0">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={image} />
        <AvatarFallback
          className={`bg-gradient-to-br ${gradient} text-white font-bold text-sm`}
        >
          {initial}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium text-[#2B3674] leading-relaxed">
          {type === "response" ? (
            <>
              <span className="font-bold">{admin_name}</span> merespon pengajuan{" "}
              <span className="font-bold">{request_type}</span> dari{" "}
              {requester_name}
            </>
          ) : type === "revision" ? (
            <>
              <span className="font-bold">{requester_name}</span> mengirim revisi pengajuan{" "}
              <span className="font-bold">{request_type}</span>
            </>
          ) : type === "request" ? (
            <>
              <span className="font-bold">{requester_name}</span> mengirim pengajuan{" "}
              <span className="font-bold">{request_type}</span>
            </>
          ) : (
            <>
              Status pengajuan <span className="font-bold">{request_type}</span>{" "}
              {requester_name} diperbarui menjadi{" "}
              <span className={`font-bold ${colorClass}`}>
                {translateStatus(status)}
              </span>
            </>
          )}
        </p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
    <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center">
      <Icon className="h-6 w-6 text-gray-300" />
    </div>
    <p className="text-sm text-gray-400 font-medium">{message}</p>
  </div>
);

const RightPanel = () => {
  const { notifications, handleNotificationClick } = useOutletContext();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = () => getDashboardActivities(setActivities, null);
    fetchActivities();
    const interval = setInterval(fetchActivities, 60000);
    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "request":
      case "revision":
        return Bell;
      case "user":
        return User;
      default:
        return Info;
    }
  };

  const getNotificationVariant = (type) => {
    switch (type) {
      case "request":
        return "blue";
      case "revision":
        return "green";
      case "user":
        return "purple";
      default:
        return "green";
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <Card className="premium-card rounded-[20px] border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-[#2B3674] font-bold">Notifikasi</CardTitle>
            {unreadCount > 0 && (
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              </span>
            )}
          </div>
          <Link
            to="/admin/pengajuan"
            className="text-xs font-bold text-[#4318FF] hover:underline"
          >
            Lihat Semua
          </Link>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            notifications
              .slice(0, 3)
              .map((notif, idx) => (
                <NotificationItem
                  key={idx}
                  id={notif.id}
                  icon={getNotificationIcon(notif.type)}
                  title={notif.title}
                  request_type={notif.request_type}
                  time={formatDateRelative(notif.time)}
                  variant={getNotificationVariant(notif.type)}
                  is_read={notif.is_read}
                  onClick={() => handleNotificationClick(notif)}
                />
              ))
          ) : (
            <EmptyState icon={Bell} message="Tidak ada notifikasi baru" />
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="premium-card rounded-[20px] border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#2B3674] font-bold">
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            activities.map((activity, idx) => (
              <ActivityItem
                key={idx}
                admin_name={activity.admin_name}
                requester_name={activity.requester_name}
                request_type={activity.request_type}
                status={activity.status}
                time={formatDateRelative(activity.time)}
                image={activity.image}
                type={activity.type}
              />
            ))
          ) : (
            <EmptyState icon={ActivityIcon} message="Tidak ada aktivitas terbaru" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RightPanel;
