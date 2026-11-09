import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  subValue?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon: Icon,
  iconColor,
  subValue,
}) => {
  return (
    <div className="agentdev-card p-3.5">
      <div className="flex items-center justify-between text-slate-400">
        <span className="text-[11px] font-mono uppercase tracking-wider">{label}</span>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className="text-xl font-bold text-white mt-1.5 flex items-baseline gap-2">
        <span>{value}</span>
        {subValue && <span className="text-xs text-slate-400 font-mono font-normal">({subValue})</span>}
      </div>
    </div>
  );
};
