import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import BASE_URL from "../../utils/api";
import { 
  MessageSquare, 
  RefreshCw, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  QrCode,
  History,
  Send,
  Loader2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "../../utils/hooks/useToast";
import { formatDateRelative } from "../../utils/helpers";

const WhatsAppManager = () => {
  const [status, setStatus] = useState({ status: "loading", hasQR: false, message: "" });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState({ status: true, logs: true, action: false });
  const [qrUrl, setQrUrl] = useState(null);
  const [testForm, setTestForm] = useState({ phone: "", message: "Halo, ini adalah pesan tes dari sistem SIPEKAD." });
  const { showToast } = useToast();

  const fetchStatus = useCallback(async () => {
    const token = localStorage.getItem("tokenKey");
    try {
      const response = await axios.get(`${BASE_URL}/whatsapp/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus(response.data);
      
      // If QR is pending, fetch the image
      if (response.data.status === "qr_pending") {
        fetchQR();
      } else {
        setQrUrl(null);
      }
    } catch (err) {
      console.error("Failed to fetch WhatsApp status", err);
    } finally {
      setLoading(prev => ({ ...prev, status: false }));
    }
  }, []);

  const fetchQR = async () => {
    const token = localStorage.getItem("tokenKey");
    try {
      const response = await axios.get(`${BASE_URL}/whatsapp/qr`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = URL.createObjectURL(response.data);
      setQrUrl(url);
    } catch (err) {
      console.error("Failed to fetch QR code", err);
    }
  };

  const fetchLogs = useCallback(async () => {
    const token = localStorage.getItem("tokenKey");
    try {
      const response = await axios.get(`${BASE_URL}/whatsapp/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status === "success") {
        setLogs(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(prev => ({ ...prev, logs: false }));
    }
  }, []);

  const handleAction = async (actionType) => {
    setLoading(prev => ({ ...prev, action: true }));
    const token = localStorage.getItem("tokenKey");
    try {
      const response = await axios.post(`${BASE_URL}/whatsapp/${actionType}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast(response.data.message || "Aksi berhasil dialankan", "success");
      
      // Small delay then refresh
      setTimeout(() => {
        fetchStatus();
        fetchLogs();
      }, 1000);
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal menjalankan aksi", "error");
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleTestMessage = async (e) => {
    e.preventDefault();
    if (!testForm.phone || !testForm.message) return;

    setLoading(prev => ({ ...prev, action: true }));
    const token = localStorage.getItem("tokenKey");
    try {
      const response = await axios.post(`${BASE_URL}/whatsapp/test-message`, testForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast(response.data.message || "Pesan tes sedang dikirim", "success");
      setTestForm({ ...testForm, phone: "" });
      
      setTimeout(fetchLogs, 2000);
    } catch (err) {
      showToast(err.response?.data?.message || "Gagal mengirim pesan tes", "error");
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchLogs();

    // Auto refresh status every 10 seconds if not connected
    const interval = setInterval(() => {
      if (status.status !== "connected") {
        fetchStatus();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchStatus, fetchLogs, status.status]);

  const StatusIcon = () => {
    switch (status.status) {
      case "connected":
        return <CheckCircle2 className="h-10 w-10 text-emerald-500" />;
      case "qr_pending":
        return <QrCode className="h-10 w-10 text-amber-500" />;
      case "offline":
        return <XCircle className="h-10 w-10 text-rose-500" />;
      default:
        return <RefreshCw className="h-10 w-10 text-blue-500 animate-spin" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#2B3674]">WhatsApp Bot Control</h2>
          <p className="text-gray-500">Kelola notifikasi WhatsApp dan pantau status koneksi bot.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => { fetchStatus(); fetchLogs(); }} 
            className="rounded-xl border-gray-200 hover:bg-gray-50"
            disabled={loading.status}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading.status ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
          <Button 
            onClick={() => handleAction('reconnect')} 
            className="bg-[#4318FF] hover:bg-[#3311CC] text-white rounded-xl shadow-lg shadow-indigo-100"
            disabled={loading.action}
          >
            {loading.action ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Reconnect Bot
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Dashboard */}
        <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-[#2B3674]">Connection Status</CardTitle>
            <CardDescription>Status koneksi saat ini</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6 text-center">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <StatusIcon />
            </div>
            <h3 className="text-xl font-bold text-[#2B3674] capitalize mb-1">{status.status.replace('_', ' ')}</h3>
            <p className="text-sm text-gray-500 max-w-[200px]">{status.message}</p>
          </CardContent>
          <CardFooter className="bg-gray-50/50 border-t border-gray-100 py-3 block">
            <Button 
              variant="ghost" 
              className="w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl"
              onClick={() => handleAction('disconnect')}
              disabled={loading.action}
            >
              <LogOut className="mr-2 h-3 w-3" />
              Reset Session / Logout
            </Button>
          </CardFooter>
        </Card>

        {/* QR Code Section */}
        <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-[#2B3674]">QR Code</CardTitle>
            <CardDescription>Scan untuk menghubungkan</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-4 min-h-[250px]">
            {status.status === "qr_pending" && qrUrl ? (
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-[#4318FF] to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <img src={qrUrl} alt="WhatsApp QR Code" className="relative w-48 h-48 rounded-xl border-4 border-white shadow-xl bg-white" />
                <div className="mt-4 text-center">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 animate-pulse">
                    Scan by March 27, 2026
                  </Badge>
                </div>
              </div>
            ) : status.status === "connected" ? (
              <div className="text-center space-y-3">
                <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-sm font-medium text-emerald-600">Bot sudah terhubung.</p>
                <p className="text-xs text-gray-400">Scan QR hanya diperlukan saat bot terputus.</p>
              </div>
            ) : (
              <div className="text-center space-y-3 p-6 text-gray-400">
                <QrCode className="h-12 w-12 mx-auto opacity-20" />
                <p className="text-sm">QR tidak tersedia saat ini.</p>
                <p className="text-xs">Klik "Reset Session" jika ingin scan ulang.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Message Form */}
        <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-[#2B3674]">Test Notification</CardTitle>
            <CardDescription>Kirim pesan tes manual</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTestMessage} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Nomor HP (Contoh: 088...)</Label>
                <Input 
                  id="phone" 
                  placeholder="081234567890" 
                  value={testForm.phone}
                  onChange={e => setTestForm({...testForm, phone: e.target.value})}
                  className="rounded-xl border-gray-200 focus:border-[#4318FF] transition-all bg-gray-50/50"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Pesan</Label>
                <Textarea 
                  id="message" 
                  placeholder="Ketik pesan di sini..." 
                  value={testForm.message}
                  onChange={e => setTestForm({...testForm, message: e.target.value})}
                  className="rounded-xl border-gray-200 focus:border-[#4318FF] transition-all bg-gray-50/50 min-h-[100px]"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#4318FF] hover:bg-[#3311CC] text-white rounded-xl shadow-lg shadow-indigo-100"
                disabled={loading.action || status.status !== 'connected'}
              >
                <Send className="mr-2 h-4 w-4" />
                Kirim Pesan Tes
              </Button>
              {status.status !== 'connected' && (
                <p className="text-[10px] text-center text-rose-500 font-medium opacity-80 flex items-center justify-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> Bot harus terhubung untuk mengirim pesan
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-bold text-[#2B3674]">Message History</CardTitle>
            <CardDescription>50 pesan terakhir yang dikirim sistem</CardDescription>
          </div>
          <div className="p-2 bg-indigo-50 rounded-xl">
            <History className="h-5 w-5 text-[#4318FF]" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-[#A3AED0] font-bold">
                <tr>
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4">Penerima</th>
                  <th className="px-6 py-4">Isi Pesan</th>
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
                    <tr key={log.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4 font-medium whitespace-nowrap">
                        {formatDateRelative(log.created_at)}
                      </td>
                      <td className="px-6 py-4 font-bold tracking-tight">
                        {log.phone}
                      </td>
                      <td className="px-6 py-4 max-w-xs xl:max-w-md">
                        <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">
                          {log.message}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {log.status === "sent" ? (
                          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase">
                            Success
                          </Badge>
                        ) : (
                          <div className="flex flex-col items-center gap-1 group relative">
                            <Badge className="bg-rose-50 text-rose-600 border-rose-100 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase cursor-help">
                              Failed
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
                      <p className="text-sm font-medium">Belum ada riwayat pesan.</p>
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

export default WhatsAppManager;
