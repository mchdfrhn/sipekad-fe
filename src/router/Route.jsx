import { createBrowserRouter } from "react-router";
// Homepage
import App from "../App";

// Auth
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";

// Dashboard
import LayoutDashboard from "../components/Dashboard/LayoutDashboard";
import DashboardHome from "../components/Dashboard/DashboardHome";
import DashboardRequest from "../components/Dashboard/DashboardRequest";
import DashboardUser from "../components/Dashboard/DashboardUser";
import Settings from "../pages/Settings";

// admin
import LayoutAdmin from "../components/admin/LayoutAdmin";
import User from "../components/admin/user/User";
import RequestLayout from "../components/admin/RequestLayout";
import MainAdmin from "../components/admin/MainAdmin";
import LayoutUser from "../components/admin/LayoutUser";
import UserDetail from "../components/admin/user/UserDetail";
import RequestAdmin from "../components/admin/request/Requests";
import RequestDetail from "../components/admin/request/RequestDetail";
import Backup from "../pages/admin/Backup";

// Request
import Request from "../components/Request/Request";
import SuratKeterangan from "../components/Request/SuratKeterangan";
import SuratPengajuan from "../components/Request/SuratPengajuan";
import SuratPenjugasan from "../components/Request/SuratPenjugasan";
import SuratSempro from "../components/Request/SuratSempro";
import Skripsi from "../components/Request/Skripsi";
import TranskripNilai from "../components/Request/TranskripNilai";
import Yudisium from "../components/Request/Yudisium";
import SeminarKp from "../components/Request/SeminarKp";

// Request Detail
import RequestDetailUser from "../components/requestUser/RequestDetailUser";

// Surat Keterangan
import ListKeterangan from "../components/suratKeterangan/ListKeterangan";
import KeteranganLulus from "../components/suratKeterangan/KeteranganLulus";
import MahasiswaAktif from "../components/suratKeterangan/MahasiswaAktif";
import KeteranganCuti from "../components/suratKeterangan/KeteranganCuti";
import PengunduranDiri from "../components/suratKeterangan/PengunduranDiri";

// Surat Pengajuan
import ListPengajuan from "../components/suratPengajuan/ListPengajuan";
import JudulSkripsi from "../components/suratPengajuan/JudulSkripsi";
import KerjaPraktik from "../components/suratPengajuan/KerjaPraktik";
import PengantarKerjaPraktik from "../components/suratPengajuan/PengantarKerjaPraktik";

// Penugasan
import ListPenugasan from "../components/Penugasan/ListPenugasan";
import DosenKerjaPraktik from "../components/Penugasan/DosenKerjaPraktik";
import DosenSkripsi from "../components/Penugasan/DosenSkripsi";

// User
import UserBio from "../components/User/UserBio";
import FormUpdateUser from "../components/dashboardUser/FormUpdateUser";

import PublicRoute from "../components/Auth/PublicRoute";
import ProtectedRoute from "../components/Auth/ProtectedRoute";

const Router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            index: true,
            Component: Login,
          },
          {
            path: "login",
            Component: Login,
          },
          {
            path: "register",
            Component: Register,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            Component: LayoutDashboard,
            children: [
              {
                index: true,
                Component: DashboardHome,
              },
              {
                path: ":id",
                Component: RequestDetailUser,
              },
              {
                path: "user",
                Component: DashboardUser,
                children: [
                  {
                    index: true,
                    Component: UserBio,
                  },
                ],
              },
              {
                path: "settings",
                Component: Settings,
              },
              {
                path: "request",
                Component: DashboardRequest,
                children: [
                  {
                    index: true,
                    Component: Request,
                  },
                  {
                    path: "suratketerangan",
                    Component: SuratKeterangan,
                    children: [
                      {
                        index: true,
                        Component: ListKeterangan,
                      },
                      {
                        path: "cuti",
                        Component: KeteranganCuti,
                      },
                      {
                        path: "mahasiswaaktif",
                        Component: MahasiswaAktif,
                      },
                      {
                        path: "keteranganlulus",
                        Component: KeteranganLulus,
                      },
                      {
                        path: "pengundurandiri",
                        Component: PengunduranDiri,
                      },
                    ],
                  },
                  {
                    path: "suratpengajuan",
                    Component: SuratPengajuan,
                    children: [
                      {
                        index: true,
                        Component: ListPengajuan,
                      },
                      {
                        path: "kerjapraktik",
                        Component: KerjaPraktik,
                      },
                      {
                        path: "judulskripsi",
                        Component: JudulSkripsi,
                      },
                      {
                        path: "pengantar-kerja-praktik",
                        Component: PengantarKerjaPraktik,
                      },
                    ],
                  },
                  {
                    path: "suratpenugasan",
                    Component: SuratPenjugasan,
                    children: [
                      {
                        index: true,
                        Component: ListPenugasan,
                      },
                      {
                        path: "dosenkerjapraktik",
                        Component: DosenKerjaPraktik,
                      },
                      {
                        path: "dosentugasakhir",
                        Component: DosenSkripsi,
                      },
                    ],
                  },
                  {
                    path: "transkripnilai",
                    Component: TranskripNilai,
                  },
                  {
                    path: "yudisium",
                    Component: Yudisium,
                  },
                  {
                    path: "pengajuansempro",
                    Component: SuratSempro,
                  },
                  {
                    path: "seminarkp",
                    Component: SeminarKp,
                  },
                  {
                    path: "skripsi",
                    Component: Skripsi,
                  },
                ],
              },
            ],
          },
          {
            path: "/admin",
            Component: LayoutAdmin,
            children: [
              {
                index: true,
                Component: MainAdmin,
              },
              {
                path: "user",
                Component: LayoutUser,
                children: [
                  {
                    index: true,
                    Component: User,
                  },
                  {
                    path: ":id",
                    Component: UserDetail,
                  },
                ],
              },
              {
                path: "pengajuan",
                Component: RequestLayout,
                children: [
                  {
                    index: true,
                    Component: RequestAdmin,
                  },
                  {
                    path: ":id",
                    Component: RequestDetail,
                  },
                ],
              },
              {
                path: "settings",
                Component: Settings,
              },
              {
                path: "backup",
                Component: Backup,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default Router;
