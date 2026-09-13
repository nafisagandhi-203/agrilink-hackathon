import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="w-full p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 shimmer-wrapper">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-16"></div>
      </div>
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-4/5"></div>
      </div>
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
    </div>
  );
};

export const SkeletonTable: React.FC = () => {
  return (
    <div className="w-full p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shimmer-wrapper">
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
    </div>
  );
};
