import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";

// Static — needed immediately
import App from "../App";
import NotFound from "../pages/NotFound";
import PublicRoute from "../components/Auth/PublicRoute";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import LayoutDashboard from "../components/Dashboard/LayoutDashboard";
import LayoutAdmin from "../components/admin/LayoutAdmin";
import DashboardRequest from "../components/Dashboard/DashboardRequest";
import Request from "../components/Request/Request";

// Lazy with retry helper to auto-recover from stale chunks or transient network drops
const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      const retryKey = `sipekad_chunk_retry_${window.location.pathname}`;
      const alreadyRetried = sessionStorage.getItem(retryKey);
      if (!alreadyRetried) {
        sessionStorage.setItem(retryKey, "true");
        window.location.reload();
        return new Promise(() => {});
      }
      sessionStorage.removeItem(retryKey);
      throw error;
    }
  });

// Lazy — Auth
const Login = lazyWithRetry(() => import("../components/Auth/Login"));
const Register = lazyWithRetry(() => import("../components/Auth/Register"));
const ForgotPassword = lazyWithRetry(() => import("../components/Auth/ForgotPassword"));
const ResetPassword = lazyWithRetry(() => import("../components/Auth/ResetPassword"));

// Lazy — Dashboard
const DashboardHome = lazyWithRetry(() => import("../components/Dashboard/DashboardHome"));
const DashboardUser = lazyWithRetry(() => import("../components/Dashboard/DashboardUser"));
const Settings = lazyWithRetry(() => import("../pages/Settings"));

// Lazy — Admin
const User = lazyWithRetry(() => import("../components/admin/user/User"));
const PendingUsers = lazyWithRetry(() => import("../components/admin/user/PendingUsers"));
const RequestLayout = lazyWithRetry(() => import("../components/admin/RequestLayout"));
const MainAdmin = lazyWithRetry(() => import("../components/admin/MainAdmin"));
const LayoutUser = lazyWithRetry(() => import("../components/admin/LayoutUser"));
const UserDetail = lazyWithRetry(() => import("../components/admin/user/UserDetail"));
const RequestAdmin = lazyWithRetry(() => import("../components/admin/request/Requests"));
const RequestDetail = lazyWithRetry(() => import("../components/admin/request/RequestDetail"));
const Backup = lazyWithRetry(() => import("../pages/admin/Backup"));
const WhatsAppManager = lazyWithRetry(() => import("../pages/admin/WhatsAppManager"));
const EmailManager = lazyWithRetry(() => import("../pages/admin/EmailManager"));

// Lazy — Request
const SuratKeterangan = lazyWithRetry(() => import("../components/Request/SuratKeterangan"));
const SuratPengajuan = lazyWithRetry(() => import("../components/Request/SuratPengajuan"));
const SuratPenjugasan = lazyWithRetry(() => import("../components/Request/SuratPenjugasan"));
const SuratSempro = lazyWithRetry(() => import("../components/Request/SuratSempro"));
const Skripsi = lazyWithRetry(() => import("../components/Request/Skripsi"));
const TranskripNilai = lazyWithRetry(() => import("../components/Request/TranskripNilai"));
const Yudisium = lazyWithRetry(() => import("../components/Request/Yudisium"));
const SeminarKp = lazyWithRetry(() => import("../components/Request/SeminarKp"));

// Lazy — Request Detail
const RequestDetailUser = lazyWithRetry(() => import("../components/requestUser/RequestDetailUser"));

// Lazy — Surat Keterangan
const ListKeterangan = lazyWithRetry(() => import("../components/suratKeterangan/ListKeterangan"));
const KeteranganLulus = lazyWithRetry(() => import("../components/suratKeterangan/KeteranganLulus"));
const MahasiswaAktif = lazyWithRetry(() => import("../components/suratKeterangan/MahasiswaAktif"));
const KeteranganCuti = lazyWithRetry(() => import("../components/suratKeterangan/KeteranganCuti"));
const PengunduranDiri = lazyWithRetry(() => import("../components/suratKeterangan/PengunduranDiri"));

// Lazy — Surat Pengajuan
const ListPengajuan = lazyWithRetry(() => import("../components/suratPengajuan/ListPengajuan"));
const JudulSkripsi = lazyWithRetry(() => import("../components/suratPengajuan/JudulSkripsi"));
const KerjaPraktik = lazyWithRetry(() => import("../components/suratPengajuan/KerjaPraktik"));
const PengantarKerjaPraktik = lazyWithRetry(() => import("../components/suratPengajuan/PengantarKerjaPraktik"));

// Lazy — Penugasan
const ListPenugasan = lazyWithRetry(() => import("../components/Penugasan/ListPenugasan"));
const DosenKerjaPraktik = lazyWithRetry(() => import("../components/Penugasan/DosenKerjaPraktik"));
const DosenSkripsi = lazyWithRetry(() => import("../components/Penugasan/DosenSkripsi"));

// Lazy — User
const UserBio = lazyWithRetry(() => import("../components/User/UserBio"));

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
                element: <DashboardRequest />,
                children: [
                  {
                    index: true,
                    element: <Request />,
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
                    path: "pending",
                    element: w(PendingUsers),
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
              {
                path: "email",
                element: w(EmailManager),
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
