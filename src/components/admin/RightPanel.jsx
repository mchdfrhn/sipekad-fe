import { Bell, User, Settings, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NotificationItem = ({ icon: Icon, title, time, variant = "blue" }) => {
  const bgColors = {
    blue: "bg-blue-50 text-blue-500",
    green: "bg-green-50 text-green-500",
    red: "bg-red-50 text-red-500",
    purple: "bg-purple-50 text-purple-500",
  };
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className={`p-2 rounded-xl ${bgColors[variant]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-[#2B3674]">{title}</h4>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
};

const ActivityItem = ({ name, action, time, image }) => (
  <div className="flex items-center gap-4 mb-5">
    <Avatar className="h-10 w-10">
      <AvatarImage src={image} />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
    <div>
      <p className="text-sm font-medium text-[#2B3674]">
        <span className="font-bold">{name}</span> {action}
      </p>
      <p className="text-xs text-gray-400 mt-1">{time}</p>
    </div>
  </div>
);

const RightPanel = () => {
  return (
    <div className="space-y-6">
      {/* Notifications */}
      <Card className="rounded-[20px]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Notifications</CardTitle>
          <div className="bg-blue-50 p-2 rounded-full cursor-pointer hover:bg-blue-100">
            <Settings className="h-5 w-5 text-[#4318FF]" />
          </div>
        </CardHeader>
        <CardContent>
          <NotificationItem
            icon={Bell}
            title="New Request Submitted"
            time="Just now"
            variant="blue"
          />
          <NotificationItem
            icon={User}
            title="New User Registered"
            time="59 minutes ago"
            variant="purple"
          />
          <NotificationItem
            icon={Info}
            title="System Update Completed"
            time="12 hours ago"
            variant="green"
          />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="rounded-[20px]">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityItem
            name="Andi Lane"
            action="submitted a request"
            time="Today, 11:59 AM"
            image="https://github.com/shadcn.png"
          />
          <ActivityItem
            name="Koray Okumus"
            action="updated profile"
            time="Today, 11:59 AM"
          />
          <ActivityItem
            name="Natalie Craig"
            action="login to system"
            time="Today, 11:59 AM"
          />
          <ActivityItem
            name="Orlando Diggs"
            action="approved a request"
            time="Yesterday, 9:22 AM"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RightPanel;
