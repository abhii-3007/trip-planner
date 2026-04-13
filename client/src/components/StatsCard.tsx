import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: 'navy' | 'amber' | 'green' | 'blue';
  subtitle?: string;
}

const colorMap = {
  navy:  { bg: 'bg-primary', icon: 'bg-primary-700 text-white', value: 'text-primary' },
  amber: { bg: 'bg-accent-50', icon: 'bg-accent text-primary', value: 'text-primary' },
  green: { bg: 'bg-emerald-50', icon: 'bg-emerald-500 text-white', value: 'text-emerald-700' },
  blue:  { bg: 'bg-blue-50', icon: 'bg-blue-500 text-white', value: 'text-blue-700' },
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = 'navy',
  subtitle,
}: StatsCardProps) {
  const c = colorMap[color];

  return (
    <div className={`rounded-2xl p-6 shadow-card border border-gray-100 bg-white animate-slide-up`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className={`font-heading font-bold text-3xl ${c.value}`}>{value}</p>
          {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.icon}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
