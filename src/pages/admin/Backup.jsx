import { useState, useEffect, useRef } from "react";
import {
  Database,
  HardDrive,
  Clock,
  Settings as SettingsIcon,
  Download,
  Trash2,
  RefreshCw,
  Calendar,
  Mail,
  Zap,
  CheckCircle2,
  AlertCircle,
  Play,
  FileArchive,
} from "lucide-react";
import StatsCard from "../../components/admin/StatsCard";
import {
  getBackupStats,
  getBackupHistory,
  triggerBackup,
  updateBackupConfig,
  downloadBackup,
  deleteBackup,
  getBackupProgress,
} from "../../utils/api/backup";
import { useToast } from "../../utils/hooks/useToast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomSelect from "../../components/ui/CustomSelect";

const Backup = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: "0 MB",
    lastBackup: null,
    config: null,
  });
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);
  const [backupType, setBackupType] = useState("database");
  const [configForm, setConfigForm] = useState({
    schedule_day: "Sunday",
    schedule_time: "02:00",
    retention_policy: 5,
    notification_email: "",
    is_active: true,
    backup_type: "database",
  });
  const [backupProgress, setBackupProgress] = useState({ percent: 0, message: "" });
  const pollIntervalRef = useRef(null);

  const fetchData = async () => {
    setIsLoading(true);
    const statsResult = await getBackupStats();
    if (statsResult.status === "success") {
      setStats(statsResult.data);
      if (statsResult.data.config) {
        setConfigForm(statsResult.data.config);
      }
    }

    const historyResult = await getBackupHistory();
    if (historyResult.status === "success") {
      setHistory(historyResult.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const handleManualBackup = async () => {
    setIsTriggering(true);
    setBackupProgress({ percent: 0, message: "Initiating background task..." });
    const result = await triggerBackup(backupType);
    if (result.status === "success" || result.status === "fail" && result.message === "A backup process is already running.") {
      if (result.status === "success") {
        showToast("Backup process started in background", "success");
      }
      
      // Start polling
      pollIntervalRef.current = setInterval(async () => {
        const progressRes = await getBackupProgress();
        if (progressRes) {
          setBackupProgress({ percent: progressRes.percent, message: progressRes.message });
          
          if (progressRes.status === "completed") {
            clearInterval(pollIntervalRef.current);
            setIsTriggering(false);
            setBackupProgress({ percent: 100, message: "Backup completed successfully!" });
            showToast("Backup generated successfully", "success");
            fetchData();
          } else if (progressRes.status === "failed") {
            clearInterval(pollIntervalRef.current);
            setIsTriggering(false);
            showToast(progressRes.message, "error");
          }
        }
      }, 1000);
    } else {
      showToast(result.message, "error");
      setIsTriggering(false);
    }
  };

  const handleDownload = async (filename) => {
    const result = await downloadBackup(filename);
    if (result.status === "success") {
      window.open(result.url, "_blank");
    } else {
      showToast(result.message, "error");
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) return;
    
    const result = await deleteBackup(filename);
    if (result.status === "success") {
      showToast("Backup deleted", "success");
      fetchData();
    } else {
      showToast(result.message, "error");
    }
  };

  const handleConfigSubmit = async (e) => {
    e.preventDefault();
    const result = await updateBackupConfig(configForm);
    if (result.status === "success") {
      showToast("Settings updated successfully", "success");
      fetchData();
    } else {
      showToast(result.message, "error");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const daysOptions = [
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
    { label: "Sunday", value: "Sunday" },
  ];

  const typeOptions = [
    { label: "Database Only", value: "database" },
    { label: "Database + Media", value: "all" },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          {/* <h2 className="text-2xl font-bold text-[#2B3674]">System Backup</h2> */}
          <p className="text-[#A3AED0] text-sm mt-1">
            Manage your S3 backups, schedule weekly jobs, and view history.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchData}
          disabled={isLoading}
          className="rounded-xl border-gray-100 text-[#2B3674] font-bold"
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
          Refresh Data
        </Button>
      </div>

      {/* Row 1: Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Backup Status"
          value={stats.config?.is_active ? "Active" : "Disabled"}
          icon={CheckCircle2}
          variant={stats.config?.is_active ? "green" : "red"}
        />
        <StatsCard
          title="Total Backups"
          value={stats.totalFiles}
          icon={Database}
          variant="blue"
        />
        <StatsCard
          title="Storage Used"
          value={stats.totalSize}
          icon={HardDrive}
          variant="purple"
        />
        <StatsCard
          title="Last Success"
          value={stats.lastBackup ? new Date(stats.lastBackup).toLocaleDateString() : "Never"}
          icon={Clock}
          variant="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Manual Control & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Section */}
          <Card className="border-none shadow-xl shadow-shadow-500/10 rounded-[20px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-[#2B3674] flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#4318FF]" />
                Manual Control
              </CardTitle>
              <CardDescription>Trigger an immediate backup task.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full flex flex-col gap-4">
                <div className="flex flex-col md:flex-row items-end gap-4">
                  <div className="flex-1 space-y-2 w-full">
                    <Label className="text-sm font-bold text-[#2B3674] ml-1">Backup Type</Label>
                    <CustomSelect
                      value={backupType}
                      onChange={setBackupType}
                      options={typeOptions}
                      className="w-full"
                    />
                  </div>
                  <Button
                    onClick={handleManualBackup}
                    disabled={isTriggering}
                    className="w-full md:w-fit rounded-xl px-8 h-11 bg-[#4318FF] hover:bg-[#3311db] font-bold shadow-lg shadow-indigo-500/20"
                  >
                    {isTriggering ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Generate Backup Now
                  </Button>
                </div>
                
                {/* Progress Bar UI */}
                {isTriggering && (
                  <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden shadow-inner flex items-center relative transition-all">
                    <div
                      className="bg-indigo-500 h-full transition-all duration-300 ease-out relative"
                      style={{ width: `${backupProgress.percent}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
                    </div>
                    <span className="absolute w-full flex justify-center text-xs font-bold z-10 text-[#2B3674]">
                      {backupProgress.message || `Generating... ${backupProgress.percent}%`}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Table: History */}
          <Card className="border-none shadow-xl shadow-shadow-500/10 rounded-[20px]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#2B3674] flex items-center gap-2">
                <FileArchive className="w-5 h-5 text-[#4318FF]" />
                Backup History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/50">
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-3 text-left text-[10px] uppercase font-bold text-[#A3AED0]">File Name</th>
                      <th className="px-4 py-3 text-left text-[10px] uppercase font-bold text-[#A3AED0]">Date</th>
                      <th className="px-4 py-3 text-left text-[10px] uppercase font-bold text-[#A3AED0]">Size</th>
                      <th className="px-4 py-3 text-left text-[10px] uppercase font-bold text-[#A3AED0]">Method</th>
                      <th className="px-4 py-3 text-right text-[10px] uppercase font-bold text-[#A3AED0]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length > 0 ? (
                      history.map((item) => (
                        <tr key={item.name} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 font-bold text-[#2B3674] text-sm truncate max-w-[200px]">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 text-[#A3AED0] text-sm whitespace-nowrap">
                            {formatDate(item.lastModified)}
                          </td>
                          <td className="px-4 py-3 text-[#2B3674] font-medium text-sm">
                            {(item.size / (1024 * 1024)).toFixed(2)} MB
                          </td>
                          <td className="px-4 py-3">
                            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-bold text-[10px]">
                              {item.method}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDownload(item.name)}
                                className="h-8 w-8 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(item.name)}
                                className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-gray-400 font-medium">
                          No backup files found on S3.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Settings */}
        <div className="lg:col-span-1">
          <Card className="border-none shadow-xl shadow-shadow-500/10 rounded-[20px]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#2B3674] flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-[#4318FF]" />
                Weekly Settings
              </CardTitle>
              <CardDescription>Configure automatic backup tasks.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleConfigSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-[#2B3674] ml-1">Frequency Day</Label>
                  <CustomSelect
                    value={configForm.schedule_day}
                    onChange={(val) => setConfigForm({ ...configForm, schedule_day: val })}
                    options={daysOptions}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-[#2B3674] ml-1">Execution Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="time"
                      value={configForm.schedule_time}
                      onChange={(e) => setConfigForm({ ...configForm, schedule_time: e.target.value })}
                      className="pl-10 h-11 rounded-xl border-gray-100 bg-gray-50/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-[#2B3674] ml-1">Retention Policy</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      min="1"
                      placeholder="Files to keep"
                      value={configForm.retention_policy}
                      onChange={(e) => setConfigForm({ ...configForm, retention_policy: parseInt(e.target.value) })}
                      className="pl-10 h-11 rounded-xl border-gray-100 bg-gray-50/30"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 pl-1 mt-1 font-medium italic">
                    Keep last {configForm.retention_policy} backup files.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-[#2B3674] ml-1">Report Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="admin@example.com"
                      value={configForm.notification_email || ""}
                      onChange={(e) => setConfigForm({ ...configForm, notification_email: e.target.value })}
                      className="pl-10 h-11 rounded-xl border-gray-100 bg-gray-50/30"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                  <span className="text-sm font-bold text-[#2B3674]">Auto-Backup Enabled</span>
                  <input
                    type="checkbox"
                    checked={configForm.is_active}
                    onChange={(e) => setConfigForm({ ...configForm, is_active: e.target.checked })}
                    className="w-5 h-5 rounded accent-[#4318FF]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-bold rounded-xl mt-4 bg-[#4318FF] hover:bg-[#3311db]"
                >
                  Save Configuration
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Alert Security */}
          <div className="mt-6 p-4 bg-red-50 rounded-[20px] flex gap-3 border border-red-100">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-red-700">Restore Security</p>
              <p className="text-[10px] text-red-600 mt-1 leading-relaxed">
                Database restore will overwrite current data. This action is restricted to super-admin with password verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backup;

// Helper function for classNames
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
