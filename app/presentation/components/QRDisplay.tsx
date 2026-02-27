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
      <div className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-[0_0_60px_rgba(34,211,238,0.2)] flex flex-col items-center gap-5 max-w-2xl w-full mx-4">
        <h3 className="text-2xl font-bold text-white text-center">
          📸 PHOTO CAPTURED!
        </h3>

        <p className="text-gray-300 text-sm text-center">
          สแกน QR Code เพื่อดาวน์โหลดรูปลงมือถือ
        </p>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Main Photo Preview */}
          {imageUrl && (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 max-w-[280px]">
              <img
                src={imageUrl}
                alt="Captured Photo"
                className="w-full h-auto object-contain"
              />
            </div>
          )}

          {/* QR & Actions */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-lg">
              <img
                src={qr}
                alt="QR Code"
                width={140}
                height={140}
                className="rounded-lg"
              />
            </div>

            {/* Mobile Download Button */}
            {imageUrl && (
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium rounded-xl transition-colors text-sm"
              >
                📥 โหลดรูปลงมือถือ
              </a>
            )}
          </div>
        </div>

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
