import { Star } from 'lucide-react';

export default function Rating({ value = 0, count }) {
  return (
    <div className="flex items-center gap-1 text-sm">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={15}
          className={index < Math.round(value) ? 'fill-accent-400 text-accent-400' : 'text-slate-300'}
        />
      ))}
      {count !== undefined && <span className="ml-1 text-slate-500">({count})</span>}
    </div>
  );
}

