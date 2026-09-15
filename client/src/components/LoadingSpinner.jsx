import { Sparkles } from "lucide-react";

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-20 h-full">
    <div className="relative flex items-center justify-center w-16 h-16">
      {/* Outer pulsing ring */}
      <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 animate-ping opacity-75" />
      
      {/* Inner glowing core */}
      <div className="absolute inset-2 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-full shadow-lg shadow-teal-500/30 flex items-center justify-center text-white">
        <Sparkles size={20} className="animate-pulse" />
      </div>
    </div>
    <div className="mt-6 flex flex-col items-center gap-1">
      <h3 className="text-zinc-900 font-medium text-lg">Crafting your content</h3>
      <p className="text-sm text-zinc-500 animate-pulse">Running AI models in the background...</p>
    </div>
  </div>
);

export default LoadingSpinner;