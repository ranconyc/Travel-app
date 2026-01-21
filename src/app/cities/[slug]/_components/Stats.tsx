import { Calendar, Clock, Users } from "lucide-react";

export default function Stats() {
  return (
    <div className="flex items-center justify-between px-2 py-4 bg-surface/50 rounded-2xl backdrop-blur-sm border border-surface-secondary">
      <div className="text-center flex-1">
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-bold font-sora">{"3-4 days"}</span>
          <span className="text-xs text-secondary font-bold uppercase tracking-widest flex items-center gap-1">
            <Clock size={10} /> Duration
          </span>
        </div>
      </div>
      <div className="text-center flex-1 border-l border-r border-surface-secondary">
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-bold font-sora">1M</span>
          <span className="text-xs text-secondary font-bold uppercase tracking-widest flex items-center gap-1">
            <Users size={10} /> People
          </span>
        </div>
      </div>
      <div className="text-center flex-1">
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-bold font-sora capitalize truncate w-full px-1">
            {"Year-round"}
          </span>
          <span className="text-xs text-secondary font-bold uppercase tracking-widest flex items-center gap-1">
            <Calendar size={10} /> Season
          </span>
        </div>
      </div>
    </div>
  );
}
