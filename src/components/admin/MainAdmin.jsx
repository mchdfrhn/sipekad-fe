import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getSummeryData } from "../../utils/api/dashboardValue";
import DistribusiPengajuan from "../chart/DistribusiPengajuan";
import StraightAnglePieChart from "../chart/PieChart";
import SimpleBarChart from "../chart/BarChart";
import StatsCard from "./StatsCard";
import RightPanel from "./RightPanel"; // Import RightPanel
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MainAdmin = () => {
  const navigate = useNavigate();
  const [summery, setSummery] = useState([]);

  // Map each card index to its filter value for /admin/pengajuan page
  // index 0=Total(all), 1=Pending, 2=Canceled, 3=Completed
  const filterMap = [
    null, // Total — no filter
    "pending", // Diproses
    "canceled", // Ditolak
    "completed", // Sukses
  ];

  const handleCardClick = (index) => {
    const filter = filterMap[index];
    if (filter) {
      navigate(`/admin/pengajuan?status=${filter}`);
    } else {
      navigate("/admin/pengajuan");
    }
  };

  useEffect(() => {
    getSummeryData(setSummery);
  }, []);

  const getIcon = (index) => {
    switch (index) {
      case 0:
        return FileText;
      case 1:
        return Clock;
      case 2:
        return XCircle;
      case 3:
        return CheckCircle;
      default:
        return FileText;
    }
  };

  // Define variants for the stats cards
  const getVariant = (index) => {
    switch (index) {
      case 0:
        return "blue";
      case 1:
        return "orange";
      case 2:
        return "red";
      case 3:
        return "green";
      default:
        return "default";
    }
  };

  const getData = (index) =>
    summery[index] || { label: "Loading...", value: 0 };

  return (
    <div className="space-y-6">
      {/* Row 1: Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((index) => {
          const data = getData(index);
          const Icon = getIcon(index);
          const variant = index === 0 ? "premium" : getVariant(index);
          return (
            <StatsCard
              key={index}
              title={data.label}
              value={data.value}
              icon={Icon}
              variant={variant}
              onClick={() => handleCardClick(index)}
            />
          );
        })}
      </div>

      {/* Row 2: Main Chart + Right Panel (Notifications) */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Left Column (Charts) - Spans 2 columns on LG */}
        <div className="lg:col-span-2 space-y-6">
          {/* Total Distribution - Area Chart */}
          <Card className="rounded-[20px]">
            <CardHeader>
              <CardTitle>Distribusi Pengajuan</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="h-[300px] w-full min-h-[300px]">
                <DistribusiPengajuan days={30} />
              </div>
            </CardContent>
          </Card>

          {/* Weekly Stats & Status - Grid inside Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Weekly Bar Chart */}
            <Card className="rounded-[20px]">
              <CardHeader>
                <CardTitle>Grafik Mingguan</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="h-[250px] w-full min-h-[250px]">
                  <SimpleBarChart />
                </div>
              </CardContent>
            </Card>

            {/* Status Donut Chart */}
            <Card className="rounded-[20px]">
              <CardHeader>
                <CardTitle>Statistik Status</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="h-[250px] w-full min-h-[250px] flex items-center justify-center">
                  <StraightAnglePieChart />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column (Notifications/Activity) - Spans 1 column on LG */}
        <div className="lg:col-span-1">
          <RightPanel />
        </div>
      </div>
    </div>
  );
};

export default MainAdmin;
