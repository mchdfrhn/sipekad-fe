import {
  Bell,
  User,
  Settings,
  Info,
  Briefcase,
  ExternalLink,
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
      className={`flex items-start gap-4 mb-6 last:mb-0 group hover:bg-gray-50 p-2 -m-2 rounded-xl transition-colors cursor-pointer relative ${
        !is_read ? "bg-blue-50/50" : ""
      }`}
    >
      {!is_read && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#4318FF] rounded-full" />
      )}
      <div className={`p-2 rounded-xl shrink-0 ${bgColors[variant]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 pr-4">
        <h4
          className={`text-sm text-[#2B3674] group-hover:text-[#4318FF] transition-colors ${!is_read ? "font-bold" : "font-medium"}`}
        >
          {title}{" "}
          <span className="text-gray-500 font-medium">{request_type}</span>
        </h4>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
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
    ditolak: "text-[#A3AED0]",
    canceled: "text-[#A3AED0]",
    cancel: "text-[#A3AED0]",
    diproses: "text-orange-500",
    proses: "text-orange-500",
    pending: "text-gray-400",
  };

  const statusLabel = status?.toLowerCase() || "";
  const colorClass = statusColors[statusLabel] || "text-blue-500";

  // Helper to translate status for display
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

  return (
    <div className="flex items-center gap-4 mb-5 last:mb-0">
      <Avatar className="h-10 w-10">
        <AvatarImage src={image} />
        <AvatarFallback>{admin_name?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium text-[#2B3674] leading-relaxed">
          {type === "response" ? (
            <>
              <span className="font-bold">{admin_name}</span> merespon pengajuan{" "}
              <span className="font-bold">{request_type}</span> dari{" "}
              {requester_name}
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

const RightPanel = () => {
  const { notifications, handleNotificationClick } = useOutletContext();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Only fetch activities here, notifications come from context
    getDashboardActivities(setActivities, null);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "request":
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
      case "user":
        return "purple";
      default:
        return "green";
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <Card className="rounded-[20px] border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-[#2B3674] font-bold">Notifikasi</CardTitle>
          <div className="bg-blue-50 p-2 rounded-full cursor-pointer hover:bg-blue-100 transition-colors">
            <Settings className="h-5 w-5 text-[#4318FF]" />
          </div>
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
            <p className="text-sm text-gray-400 text-center py-8">
              Tidak ada notifikasi baru
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="rounded-[20px] border-none shadow-sm">
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
            <p className="text-sm text-gray-400 text-center py-8">
              Tidak ada aktivitas terbaru
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RightPanel;
