import { useNavigate } from "react-router-dom";
import { CheckSquare, MoveLeft, Home } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-accent blur-[100px] opacity-10 top-[120px] right-[100px]" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-[#a78bfa] blur-[80px] opacity-10 bottom-[80px] left-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-[420px]">
        {/* Logo */}
        <div className="flex items-center gap-2 text-accent text-base font-bold mb-12 tracking-tight">
          <CheckSquare size={20} />
          <span>Taskly</span>
        </div>

        {/* 404 */}
        <p className="font-mono font-bold text-[120px] leading-none bg-linear-to-b from-text to-text-dim bg-clip-text text-transparent select-none mb-2">
          404
        </p>

        {/* Message */}
        <h1 className="text-xl font-semibold text-text mb-3">
          Halaman tidak ditemukan
        </h1>
        <p className="text-sm text-text-muted leading-relaxed mb-10">
          URL yang kamu masukkan tidak tersedia. Mungkin salah ketik atau
          halaman sudah dipindahkan.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-transparent border border-border text-text-muted rounded-sm font-sans text-sm font-medium px-4 py-2.5 cursor-pointer transition-all duration-[0.18s] hover:text-text hover:border-border-light hover:bg-bg-card2"
          >
            <MoveLeft size={15} /> Kembali
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-accent text-white border-none rounded-sm font-sans text-sm font-semibold px-4 py-2.5 cursor-pointer transition-all duration-[0.18s] hover:bg-accent-hover hover:shadow-accent hover:-translate-y-px"
          >
            <Home size={15} /> Ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
