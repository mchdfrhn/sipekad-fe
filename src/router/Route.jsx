import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";

// Static — needed immediately
import App from "../App";
import NotFound from "../pages/NotFound";
import PublicRoute from "../components/Auth/PublicRoute";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import LayoutDashboard from "../components/Dashboard/LayoutDashboard";
import LayoutAdmin from "../components/admin/LayoutAdmin";

// Lazy — Auth
const Login = lazy(() => import("../components/Auth/Login"));
const Register = lazy(() => import("../components/Auth/Register"));
const ForgotPassword = lazy(() => import("../components/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../components/Auth/ResetPassword"));

// Lazy — Dashboard
const DashboardHome = lazy(() => import("../components/Dashboard/DashboardHome"));
const DashboardRequest = lazy(() => import("../components/Dashboard/DashboardRequest"));
const DashboardUser = lazy(() => import("../components/Dashboard/DashboardUser"));
const Settings = lazy(() => import("../pages/Settings"));

// Lazy — Admin
const User = lazy(() => import("../components/admin/user/User"));
const RequestLayout = lazy(() => import("../components/admin/RequestLayout"));
const MainAdmin = lazy(() => import("../components/admin/MainAdmin"));
const LayoutUser = lazy(() => import("../components/admin/LayoutUser"));
const UserDetail = lazy(() => import("../components/admin/user/UserDetail"));
const RequestAdmin = lazy(() => import("../components/admin/request/Requests"));
const RequestDetail = lazy(() => import("../components/admin/request/RequestDetail"));
const Backup = lazy(() => import("../pages/admin/Backup"));
const WhatsAppManager = lazy(() => import("../pages/admin/WhatsAppManager"));

// Lazy — Request
const Request = lazy(() => import("../components/Request/Request"));
const SuratKeterangan = lazy(() => import("../components/Request/SuratKeterangan"));
const SuratPengajuan = lazy(() => import("../components/Request/SuratPengajuan"));
const SuratPenjugasan = lazy(() => import("../components/Request/SuratPenjugasan"));
const SuratSempro = lazy(() => import("../components/Request/SuratSempro"));
const Skripsi = lazy(() => import("../components/Request/Skripsi"));
const TranskripNilai = lazy(() => import("../components/Request/TranskripNilai"));
const Yudisium = lazy(() => import("../components/Request/Yudisium"));
const SeminarKp = lazy(() => import("../components/Request/SeminarKp"));

// Lazy — Request Detail
const RequestDetailUser = lazy(() => import("../components/requestUser/RequestDetailUser"));

// Lazy — Surat Keterangan
const ListKeterangan = lazy(() => import("../components/suratKeterangan/ListKeterangan"));
const KeteranganLulus = lazy(() => import("../components/suratKeterangan/KeteranganLulus"));
const MahasiswaAktif = lazy(() => import("../components/suratKeterangan/MahasiswaAktif"));
const KeteranganCuti = lazy(() => import("../components/suratKeterangan/KeteranganCuti"));
const PengunduranDiri = lazy(() => import("../components/suratKeterangan/PengunduranDiri"));

// Lazy — Surat Pengajuan
const ListPengajuan = lazy(() => import("../components/suratPengajuan/ListPengajuan"));
const JudulSkripsi = lazy(() => import("../components/suratPengajuan/JudulSkripsi"));
const KerjaPraktik = lazy(() => import("../components/suratPengajuan/KerjaPraktik"));
const PengantarKerjaPraktik = lazy(() => import("../components/suratPengajuan/PengantarKerjaPraktik"));

// Lazy — Penugasan
const ListPenugasan = lazy(() => import("../components/Penugasan/ListPenugasan"));
const DosenKerjaPraktik = lazy(() => import("../components/Penugasan/DosenKerjaPraktik"));
const DosenSkripsi = lazy(() => import("../components/Penugasan/DosenSkripsi"));

// Lazy — User
const UserBio = lazy(() => import("../components/User/UserBio"));

const PageLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="h-7 w-7 rounded-full border-[3px] border-[#4318FF] border-t-transparent animate-spin" />
  </div>
);

const w = (C) => (
  <Suspense fallback={<PageLoader />}>
    <C />
  </Suspense>
);

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
            element: w(Login),
          },
          {
            path: "login",
            element: w(Login),
          },
          {
            path: "register",
            element: w(Register),
          },
          {
            path: "forgot-password",
            element: w(ForgotPassword),
          },
          {
            path: "reset-password",
            element: w(ResetPassword),
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
                element: w(DashboardHome),
              },
              {
                path: ":id",
                element: w(RequestDetailUser),
              },
              {
                path: "user",
                element: w(DashboardUser),
                children: [
                  {
                    index: true,
                    element: w(UserBio),
                  },
                ],
              },
              {
                path: "settings",
                element: w(Settings),
              },
              {
                path: "request",
                element: w(DashboardRequest),
                children: [
                  {
                    index: true,
                    element: w(Request),
                  },
                  {
                    path: "suratketerangan",
                    element: w(SuratKeterangan),
                    children: [
                      {
                        index: true,
                        element: w(ListKeterangan),
                      },
                      {
                        path: "cuti",
                        element: w(KeteranganCuti),
                      },
                      {
                        path: "mahasiswaaktif",
                        element: w(MahasiswaAktif),
                      },
                      {
                        path: "keteranganlulus",
                        element: w(KeteranganLulus),
                      },
                      {
                        path: "pengundurandiri",
                        element: w(PengunduranDiri),
                      },
                    ],
                  },
                  {
                    path: "suratpengajuan",
                    element: w(SuratPengajuan),
                    children: [
                      {
                        index: true,
                        element: w(ListPengajuan),
                      },
                      {
                        path: "kerjapraktik",
                        element: w(KerjaPraktik),
                      },
                      {
                        path: "judulskripsi",
                        element: w(JudulSkripsi),
                      },
                      {
                        path: "pengantar-kerja-praktik",
                        element: w(PengantarKerjaPraktik),
                      },
                    ],
                  },
                  {
                    path: "suratpenugasan",
                    element: w(SuratPenjugasan),
                    children: [
                      {
                        index: true,
                        element: w(ListPenugasan),
                      },
                      {
                        path: "dosenkerjapraktik",
                        element: w(DosenKerjaPraktik),
                      },
                      {
                        path: "dosentugasakhir",
                        element: w(DosenSkripsi),
                      },
                    ],
                  },
                  {
                    path: "transkripnilai",
                    element: w(TranskripNilai),
                  },
                  {
                    path: "yudisium",
                    element: w(Yudisium),
                  },
                  {
                    path: "pengajuansempro",
                    element: w(SuratSempro),
                  },
                  {
                    path: "seminarkp",
                    element: w(SeminarKp),
                  },
                  {
                    path: "skripsi",
                    element: w(Skripsi),
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
                element: w(MainAdmin),
              },
              {
                path: "user",
                element: w(LayoutUser),
                children: [
                  {
                    index: true,
                    element: w(User),
                  },
                  {
                    path: ":id",
                    element: w(UserDetail),
                  },
                ],
              },
              {
                path: "pengajuan",
                element: w(RequestLayout),
                children: [
                  {
                    index: true,
                    element: w(RequestAdmin),
                  },
                  {
                    path: ":id",
                    element: w(RequestDetail),
                  },
                ],
              },
              {
                path: "settings",
                element: w(Settings),
              },
              {
                path: "backup",
                element: w(Backup),
              },
              {
                path: "whatsapp",
                element: w(WhatsAppManager),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);

export default Router;
