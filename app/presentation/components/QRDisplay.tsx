export default function QRDisplay({
  qr,
  onRetake,
}: {
  qr: string | null;
  onRetake: () => void;
}) {
  if (!qr) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-[0_0_60px_rgba(34,211,238,0.2)] flex flex-col items-center gap-5 max-w-sm">
        <h3 className="text-2xl font-bold text-white text-center">
          📸 PHOTO CAPTURED!
        </h3>

        <p className="text-gray-300 text-sm text-center">
          สแกน QR Code ด้วยมือถือเพื่อดาวน์โหลดรูป
        </p>

        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <img
            src={qr}
            alt="QR Code"
            width={220}
            height={220}
            className="rounded-lg"
          />
        </div>

        <button
          className="w-full mt-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-colors text-sm tracking-wide"
          onClick={onRetake}
        >
          ถ่ายอีกครั้ง
        </button>
      </div>
    </div>
  );
}
