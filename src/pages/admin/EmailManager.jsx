import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import BASE_URL from "../../utils/api";
import { 
  Mail, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  History, 
  Send, 
  Loader2, 
  Settings2,
  Eye,
  EyeOff,
  Power
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "../../utils/hooks/useToast";
import { formatDateRelative } from "../../utils/helpers";

const EmailManager = () => {
  const [status, setStatus] = useState({ 
    status: "loading", 
    message: "", 
    is_active: true,
    config: { host: "", port: 587, secure: false, user: "", has_password: false, from: "" }
  });
  const [configForm, setConfigForm] = useState({
    smtp_host: "",
    smtp_port: 587,
    smtp_secure: false,
    smtp_user: "",
    smtp_pass: "",
    email_from: "SIPEKAD Notification <sipekad@sttpu.ac.id>",
    is_active: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState({ status: true, config: false, logs: true, action: false, testSend: false });
  const [testForm, setTestForm] = useState({ 
    to: "", 
    message: "Halo, ini adalah pesan email pengujian dari sistem SIPEKAD." 
  });
  const { showToast } = useToast();

  const fetchStatus = useCallback(async () => {
    const token = localStorage.getItem("tokenKey");
    try {
      const response = await axios.get(`${BASE_URL}/email/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data?.data) {
        const data = response.data.data;
        setStatus(data);
        if (data.config) {
          setConfigForm((prev) => ({
            ...prev,
            smtp_host: data.config.host || "",
            smtp_port: data.config.port || 587,
            smtp_secure: Boolean(data.config.secure),
            smtp_user: data.config.user || "",
            email_from: data.config.from || "SIPEKAD Notification <sipekad@sttpu.ac.id>",
            is_active: data.is_active !== false,
          }));
        }
      }
    } catch {
      // silent fail
    } finally {
      setLoading(prev => ({ ...prev, status: false }));
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    const token = localStorage.getItem("tokenKey");
    try {
      const response = await axios.get(`${BASE_URL}/email/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data?.data) {
        setLogs(response.data.data);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(prev => ({ ...prev, logs: false }));
    }
  }, []);

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, config: true }));
    const token = localStorage.getItem("tokenKey");

    try {
      const payload = {
        ...configForm,
        smtp_port: parseInt(configForm.smtp_port, 10) || 587,
      };
      // If pass is empty and we already have a password, omit sending empty password
      if (!configForm.smtp_pass && status.config?.has_password) {
        delete payload.smtp_pass;
      }

      const response = await axios.put(`${BASE_URL}/email/config`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const resData = response.data;
      if (resData.connected) {
        showToast("Konfigurasi SMTP berhasil disimpan dan terhubung!", "success");
      } else {
        showToast(
          resData.message || "Konfigurasi tersimpan di database. Periksa kredensial SMTP.",
          "warning"
        );
      }
      setConfigForm(prev => ({ ...prev, smtp_pass: "" }));
      fetchStatus();
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal menyimpan konfigurasi SMTP", "error");
    } finally {
      setLoading(prev => ({ ...prev, config: false }));
    }
  };

  const handleVerifyConnection = async () => {
    setLoading(prev => ({ ...prev, action: true }));
    const token = localStorage.getItem("tokenKey");

    try {
      const response = await axios.post(`${BASE_URL}/email/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data?.data;
      if (data?.connected) {
        showToast(data.message || "Koneksi SMTP berhasil terhubung!", "success");
      } else {
        showToast(data?.message || "Koneksi SMTP gagal diverifikasi", "error");
      }
      fetchStatus();
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal menguji koneksi SMTP", "error");
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleToggleActive = async () => {
    setLoading(prev => ({ ...prev, action: true }));
    const token = localStorage.getItem("tokenKey");

    try {
      const response = await axios.patch(
        `${BASE_URL}/email/toggle`,
        { is_active: !status.is_active },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newActive = response.data?.data?.is_active ?? !status.is_active;
      showToast(
        newActive ? "Notifikasi email berhasil diaktifkan" : "Notifikasi email dinonaktifkan",
        "success"
      );
      setStatus(prev => ({ ...prev, is_active: newActive }));
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal mengubah status aktifasi email", "error");
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleTestEmail = async (e) => {
    e.preventDefault();
    if (!testForm.to) {
      showToast("Alamat email penerima wajib diisi", "error");
      return;
    }

    setLoading(prev => ({ ...prev, testSend: true }));
    const token = localStorage.getItem("tokenKey");

    try {
      const response = await axios.post(`${BASE_URL}/email/test`, testForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast(response.data?.message || "Email tes sedang dikirim", "success");
      setTestForm(prev => ({ ...prev, to: "" }));
      setTimeout(fetchLogs, 1500);
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal mengirim pesan tes", "error");
    } finally {
      setLoading(prev => ({ ...prev, testSend: false }));
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchLogs();
  }, [fetchStatus, fetchLogs]);

  const StatusIcon = () => {
    switch (status.status) {
      case "connected":
        return <CheckCircle2 className="h-10 w-10 text-emerald-500" />;
      case "not_configured":
        return <AlertCircle className="h-10 w-10 text-amber-500" />;
      case "error":
        return <XCircle className="h-10 w-10 text-rose-500" />;
      default:
        return <RefreshCw className="h-10 w-10 text-blue-500 animate-spin" />;
    }
  };

  const getStatusLabel = () => {
    if (status.status === "connected") return "Terhubung";
    if (status.status === "not_configured") return "Belum Dikonfigurasi";
    if (status.status === "error") return "Koneksi Gagal";
    return "Memuat Status...";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-jakarta">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <Mail className="h-5 w-5 text-[#4318FF]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#2B3674]">Manajer Email</h1>
            <p className="text-sm text-[#718096]">Kelola koneksi SMTP, konfigurasi, dan kirim pesan email</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-gray-500">Kelola notifikasi email dan pantau status koneksi server SMTP.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => { fetchStatus(); fetchLogs(); }} 
            className="rounded-xl border-gray-200 hover:bg-gray-50"
            disabled={loading.status}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading.status ? 'animate-spin' : ''}`} />
            Segarkan Status
          </Button>
          <Button 
            onClick={handleVerifyConnection} 
            className="bg-[#4318FF] hover:bg-[#3311CC] text-white rounded-xl shadow-lg shadow-indigo-100"
            disabled={loading.action}
          >
            {loading.action ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Uji Koneksi SMTP
          </Button>
        </div>
      </div>

      {/* Top 3 Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Dashboard */}
        <Card className="rounded-[20px] border-gray-100/80 shadow-[0_4px_24px_rgba(67,24,255,0.06)] bg-white overflow-hidden flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-[#2B3674]">Status Email</CardTitle>
            <CardDescription>Status koneksi SMTP saat ini</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6 text-center flex-1">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <StatusIcon />
            </div>
            <h3 className="text-xl font-bold text-[#2B3674] capitalize mb-1">
              {getStatusLabel()}
            </h3>
            <p className="text-sm text-gray-500 max-w-[240px] leading-relaxed">
              {status.message || "Memeriksa koneksi SMTP..."}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <Badge variant="outline" className={`text-xs px-2.5 py-0.5 font-semibold ${
                status.is_active 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }`}>
                {status.is_active ? "Notifikasi: Aktif" : "Notifikasi: Nonaktif"}
              </Badge>
              {status.config?.host && (
                <Badge variant="secondary" className="bg-indigo-50 text-[#4318FF] font-mono text-[11px]">
                  {status.config.host}:{status.config.port}
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50/50 border-t border-gray-100 py-3 block">
            <Button 
              variant="ghost" 
              className={`w-full text-xs font-bold rounded-xl gap-2 ${
                status.is_active 
                  ? "text-rose-500 hover:text-rose-600 hover:bg-rose-50" 
                  : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              }`}
              onClick={handleToggleActive}
              disabled={loading.action}
            >
              <Power className="h-3.5 w-3.5" />
              {status.is_active ? "Nonaktifkan Pengiriman Email" : "Aktifkan Pengiriman Email"}
            </Button>
          </CardFooter>
        </Card>

        {/* SMTP Configuration Card */}
        <Card className="rounded-[20px] border-gray-100/80 shadow-[0_4px_24px_rgba(67,24,255,0.06)] bg-white overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-[#2B3674]">Konfigurasi SMTP</CardTitle>
              <Settings2 className="h-4 w-4 text-[#4318FF]" />
            </div>
            <CardDescription>Atur host, port, dan kredensial langsung di sini</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveConfig} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <Label htmlFor="smtp_host" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                    SMTP Host
                  </Label>
                  <Input
                    id="smtp_host"
                    placeholder="smtp.resend.com"
                    value={configForm.smtp_host}
                    onChange={(e) => setConfigForm({ ...configForm, smtp_host: e.target.value })}
                    className="rounded-xl border-gray-200 focus:border-[#4318FF] text-xs bg-gray-50/50 h-9"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="smtp_port" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Port
                  </Label>
                  <Input
                    id="smtp_port"
                    type="number"
                    placeholder="587"
                    value={configForm.smtp_port}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfigForm(prev => ({
                        ...prev,
                        smtp_port: val,
                        smtp_secure: val === "465"
                      }));
                    }}
                    className="rounded-xl border-gray-200 focus:border-[#4318FF] text-xs bg-gray-50/50 h-9"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 px-1">
                <input
                  type="checkbox"
                  id="smtp_secure"
                  checked={configForm.smtp_secure}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setConfigForm(prev => ({
                      ...prev,
                      smtp_secure: isChecked,
                      smtp_port: isChecked ? 465 : (prev.smtp_port === 465 ? 587 : prev.smtp_port)
                    }));
                  }}
                  className="rounded border-gray-300 text-[#4318FF] focus:ring-[#4318FF] h-4 w-4"
                />
                <Label htmlFor="smtp_secure" className="text-xs text-gray-600 cursor-pointer font-medium">
                  Gunakan SSL/TLS (Port 465)
                </Label>
              </div>

              {/* Gmail Guide helper */}
              {configForm.smtp_host?.toLowerCase().includes("gmail") && (
                <div className="p-2.5 bg-amber-50/90 border border-amber-200/90 rounded-xl text-[11px] text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span>Petunjuk Akun Gmail (smtp.gmail.com):</span>
                  </div>
                  <p className="leading-relaxed text-amber-800">
                    Google menolak password login biasa. Anda wajib membuat <strong>Sandi Aplikasi (App Password)</strong> 16 karakter:
                  </p>
                  <ol className="list-decimal list-inside space-y-0.5 text-amber-800 pl-0.5 font-medium">
                    <li>Aktifkan <strong>Verifikasi 2 Langkah</strong> pada akun Google Anda.</li>
                    <li>Buka tautan <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-indigo-700 underline font-semibold">myaccount.google.com/apppasswords</a>.</li>
                    <li>Buat sandi aplikasi baru (beri nama "SIPEKAD").</li>
                    <li>Salin 16 karakter kode lalu tempelkan ke kolom <strong>SMTP Password</strong> di bawah.</li>
                  </ol>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="smtp_user" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                  SMTP Username / Email
                </Label>
                <Input
                  id="smtp_user"
                  placeholder="resend / admin@sipekad.ac.id"
                  value={configForm.smtp_user}
                  onChange={(e) => setConfigForm({ ...configForm, smtp_user: e.target.value })}
                  className="rounded-xl border-gray-200 focus:border-[#4318FF] text-xs bg-gray-50/50 h-9"
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="smtp_pass" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    SMTP Password
                  </Label>
                  {status.config?.has_password && !configForm.smtp_pass && (
                    <span className="text-[10px] text-emerald-600 font-semibold">Tersimpan</span>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="smtp_pass"
                    type={showPassword ? "text" : "password"}
                    placeholder={status.config?.has_password ? "•••••••• (Biarkan kosong jika tidak diubah)" : "Masukkan password/API key"}
                    value={configForm.smtp_pass}
                    onChange={(e) => setConfigForm({ ...configForm, smtp_pass: e.target.value })}
                    className="rounded-xl border-gray-200 focus:border-[#4318FF] text-xs bg-gray-50/50 h-9 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email_from" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                  Nama & Email Pengirim (From)
                </Label>
                <Input
                  id="email_from"
                  placeholder="SIPEKAD Notification <sipekad@sttpu.ac.id>"
                  value={configForm.email_from}
                  onChange={(e) => setConfigForm({ ...configForm, email_from: e.target.value })}
                  className="rounded-xl border-gray-200 focus:border-[#4318FF] text-xs bg-gray-50/50 h-9"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#4318FF] hover:bg-[#3311CC] text-white rounded-xl shadow-lg shadow-indigo-100 text-xs font-bold h-9 mt-1"
                disabled={loading.config}
              >
                {loading.config ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Simpan Konfigurasi
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Test Message Form */}
        <Card className="rounded-[20px] border-gray-100/80 shadow-[0_4px_24px_rgba(67,24,255,0.06)] bg-white overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-[#2B3674]">Kirim Email Tes</CardTitle>
            <CardDescription>Kirim email tes manual</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTestEmail} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="test_to" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                  Email Penerima (Contoh: user@domain.com)
                </Label>
                <Input 
                  id="test_to" 
                  type="email"
                  placeholder="contoh@mahasiswa.ac.id" 
                  value={testForm.to}
                  onChange={e => setTestForm({ ...testForm, to: e.target.value })}
                  className="rounded-xl border-gray-200 focus:border-[#4318FF] transition-all bg-gray-50/50 text-xs h-9"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="test_message" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                  Pesan
                </Label>
                <Textarea 
                  id="test_message" 
                  placeholder="Ketik pesan di sini..." 
                  value={testForm.message}
                  onChange={e => setTestForm({ ...testForm, message: e.target.value })}
                  className="rounded-xl border-gray-200 focus:border-[#4318FF] transition-all bg-gray-50/50 min-h-[100px] text-xs"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#4318FF] hover:bg-[#3311CC] text-white rounded-xl shadow-lg shadow-indigo-100"
                disabled={loading.testSend || status.status !== 'connected'}
              >
                {loading.testSend ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Kirim Email Tes
              </Button>
              {status.status !== 'connected' && (
                <p className="text-[10px] text-center text-rose-500 font-medium opacity-80 flex items-center justify-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> SMTP harus terhubung untuk mengirim email nyata
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card className="rounded-[20px] border-gray-100/80 shadow-[0_4px_24px_rgba(67,24,255,0.06)] bg-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-bold text-[#2B3674]">Riwayat Email</CardTitle>
            <CardDescription>50 pesan terakhir yang dikirim sistem</CardDescription>
          </div>
          <div className="p-2 bg-indigo-50 rounded-xl">
            <History className="h-5 w-5 text-[#4318FF]" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-[#718096] font-bold">
                <tr>
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4">Penerima</th>
                  <th className="px-6 py-4">Subject & Tipe</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 divide-opacity-50 text-[#2B3674]">
                {loading.logs ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="4" className="px-6 py-8"><div className="h-4 bg-gray-100 rounded-full w-full"></div></td>
                    </tr>
                  ))
                ) : logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-6 py-4 font-medium whitespace-nowrap text-xs">
                        {formatDateRelative(log.created_at)}
                      </td>
                      <td className="px-6 py-4 font-bold tracking-tight text-xs">
                        <span className="text-[#4318FF]">{log.recipient_email}</span>
                        {log.recipient_name && (
                          <span className="block text-[10px] text-gray-400 font-normal">
                            {log.recipient_name}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 max-w-xs xl:max-w-md">
                        <p className="line-clamp-1 text-xs font-semibold text-[#2B3674]">
                          {log.subject}
                        </p>
                        <span className="inline-block mt-0.5 font-mono text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-600">
                          {log.template_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {log.status === "sent" ? (
                          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 px-2.5 py-1 rounded-full font-bold text-[11px] border">
                            Terkirim
                          </Badge>
                        ) : log.status === "simulated" ? (
                          <Badge className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 px-2.5 py-1 rounded-full font-bold text-[11px] border">
                            Simulasi
                          </Badge>
                        ) : (
                          <div className="flex flex-col items-center gap-1 group relative">
                            <Badge className="bg-rose-50 text-rose-600 border-rose-100 px-2.5 py-1 rounded-full font-bold text-[11px] border cursor-help">
                              Gagal
                            </Badge>
                            {log.error && (
                              <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-[10px] rounded-lg whitespace-nowrap z-50">
                                {log.error}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center text-gray-400">
                      <History className="h-10 w-10 mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-medium">Belum ada riwayat email.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailManager;
