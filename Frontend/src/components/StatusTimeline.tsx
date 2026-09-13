import React from 'react';
import { Check } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus?: string;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  currentStatus = 'In Transit'
}) => {
  const steps = [
    { label: 'Booking Confirmed', key: 'Confirmed' },
    { label: 'Pickup', key: 'Pickup' },
    { label: 'In Transit', key: 'In Transit' },
    { label: 'Delivered', key: 'Delivered' }
  ];

  const getStepState = (key: string) => {
    if (currentStatus === 'Delivered') return 'completed';
    if (currentStatus === 'In Transit') {
      if (key === 'Confirmed' || key === 'Pickup') return 'completed';
      if (key === 'In Transit') return 'active';
      return 'pending';
    }
    if (currentStatus === 'Pickup' || currentStatus === 'Pickup Completed') {
      if (key === 'Confirmed' || key === 'Pickup') return 'completed';
      return 'pending';
    }
    if (key === 'Confirmed') return 'completed';
    return 'pending';
  };

  return (
    <div className="w-full bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const state = getStepState(step.key);
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                    state === 'completed'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : state === 'active'
                      ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-600 animate-pulse'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {state === 'completed' ? (
                    <Check className="w-4 h-4" />
                  ) : state === 'active' ? (
                    '🟢'
                  ) : (
                    '○'
                  )}
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    state === 'completed' || state === 'active'
                      ? 'text-slate-900'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded-full ${
                    state === 'completed' ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
