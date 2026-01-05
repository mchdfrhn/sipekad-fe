import CardDashboard from "../ui/CardDashboard";
import StraightAnglePieChart from "../chart/PieChart";
import SimpleBarChart from "../chart/BarChart";
import { useEffect, useState } from "react";
import { getSummeryData } from "../../utils/api/dashboardValue";
import DistribusiPengajuan from "../chart/DistribusiPengajuan";
import CardDashboardUser from "./user/CardDashboardUser";

const MainAdmin = () => {
  const [summery, setSummery] = useState([]);
  useEffect(() => {
    getSummeryData(setSummery);
  }, []);
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        <CardDashboardUser index={6} title={summery[0]?.label} value={summery[0]?.value} className={"shadow-md bg-total-pengajuan"} />
        <CardDashboardUser index={7} title={summery[1]?.label} value={summery[1]?.value} className={"shadow-md bg-pengajuan-proses"} />
        <CardDashboardUser index={8} title={summery[2]?.label} value={summery[2]?.value} className={"shadow-md bg-pengajuan-ditolak"} />
        <CardDashboardUser index={9} title={summery[3]?.label} value={summery[3]?.value} className={"shadow-md bg-pengajuan-berhasil"} />
      </div>
      <div className="xl:max-h-[60vh] mt-8 grid grid-cols-1 xl:grid-cols-3 xl:grid-rows-2 gap-4 mb-10">
        <DistribusiPengajuan />
        <StraightAnglePieChart />
        <SimpleBarChart />
      </div>
    </>
  );
};

export default MainAdmin;
