export default function EmotionBars({ emotion }: any) {
  return (
    <div className="w-80 md:w-96 bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl z-10">
      <h2 className="text-xl font-bold text-white mb-4 text-center tracking-wider">
        EMOTION ANALYSIS
      </h2>
      <div className="flex flex-col gap-4">
        {Object.entries(emotion).map(([key, value]: any) => (
          <div key={key} className="flex flex-col gap-1">
            <div className="flex justify-between text-sm font-medium text-gray-200 uppercase tracking-widest">
              <span>{key}</span>
              <span>{value}%</span>
            </div>
            <div className="bg-white/10 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ease-out ${
                  key === "happy"
                    ? "bg-linear-to-r from-green-400 to-green-500 shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                    : key === "sad"
                    ? "bg-linear-to-r from-blue-400 to-blue-500 shadow-[0_0_10px_rgba(96,165,250,0.5)]"
                    : key === "angry"
                    ? "bg-linear-to-r from-red-400 to-red-500 shadow-[0_0_10px_rgba(248,113,113,0.5)]"
                    : "bg-linear-to-r from-yellow-400 to-yellow-500 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                }`}
                style={{
                  width: `${value}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
