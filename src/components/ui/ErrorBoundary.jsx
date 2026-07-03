import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F7FE] p-6 text-center">
          <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full">
            <h2 className="text-xl font-bold text-red-500 mb-2">Terjadi Kesalahan</h2>
            <p className="text-gray-500 text-sm mb-4">
              Halaman ini mengalami error. Silakan muat ulang halaman atau hubungi administrator.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-[#4318FF] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#3311CC] transition-colors cursor-pointer"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
