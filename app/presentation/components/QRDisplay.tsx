export default function QRDisplay({
  qr,
  imageUrl,
  onRetake,
}: {
  qr: string | null;
  imageUrl?: string | null;
  onRetake: () => void;
}) {
  if (!qr) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-[0_0_60px_rgba(34,211,238,0.2)] flex flex-col items-center gap-5 max-w-sm w-full">
        <h3 className="text-2xl font-bold text-white text-center">
          📸 PHOTO CAPTURED!
        </h3>

        <p className="text-gray-300 text-sm text-center">
          สแกน QR Code เพื่อดาวน์โหลดรูปลงมือถือ
        </p>

        <div className="bg-white p-4 rounded-2xl shadow-lg mt-2 mb-2">
          <img
            src={qr}
            alt="QR Code"
            width={220}
            height={220}
            className="rounded-lg"
          />
        </div>

        {/* Mobile Download Button */}
        {imageUrl && (
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium rounded-xl transition-colors text-sm"
          >
            📥 เปิดแท็บใหม่เพื่อเซฟรูป (สำหรับมือถือ)
          </a>
        )}

        {/* Retake Button */}
        <button
          className="w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-colors text-sm tracking-wide mt-2"
          onClick={onRetake}
        >
          📷 ถ่ายอีกครั้ง
        </button>
      </div>
    </div>
  );
}
