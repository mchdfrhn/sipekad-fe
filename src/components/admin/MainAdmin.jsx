import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getSummeryData } from "../../utils/api/dashboardValue";
import DistribusiPengajuan from "../chart/DistribusiPengajuan";
import StraightAnglePieChart from "../chart/PieChart";
import SimpleBarChart from "../chart/BarChart";
import StatsCard from "./StatsCard";
import RightPanel from "./RightPanel"; // Import RightPanel
import { FileText, CheckCircle, XCircle, Clock, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MainAdmin = () => {
  const navigate = useNavigate();
  const [summery, setSummery] = useState([]);

  // index 0=Total, 1=Masuk, 2=Diproses, 3=Ditolak, 4=Selesai
  const filterMap = [
    null,
    "submitted",
    "processing",
    "rejected",
    "completed",
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
    const icons = [FileText, Clock, Wrench, XCircle, CheckCircle];
    return icons[index] || FileText;
  };

  const getVariant = (index) => {
    const variants = ["blue", "orange", "teal", "red", "green"];
    return index === 0 ? "premium" : (variants[index] || "default");
  };

  const getData = (index) =>
    summery[index] || { label: "Loading...", value: 0 };

  return (
    <div className="space-y-6">
      {/* Row 1: Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {[0, 1, 2, 3, 4].map((index) => {
          const data = getData(index);
          const Icon = getIcon(index);
          const variant = getVariant(index);
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
