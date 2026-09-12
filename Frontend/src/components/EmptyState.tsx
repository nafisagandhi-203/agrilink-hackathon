import React from 'react';
import { PackageSearch, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onActionClick?: () => void;
  icon?: React.ElementType;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onActionClick,
  icon: Icon = PackageSearch
}) => {
  return (
    <div className="w-full py-12 px-4 text-center rounded-3xl bg-[#f4f8f0] border-2 border-dashed border-[#e2ebd9] flex flex-col items-center justify-center space-y-3">
      <div className="w-16 h-16 rounded-2xl bg-white text-[#538d22] border border-[#e2ebd9] flex items-center justify-center shadow-xs">
        <Icon className="w-8 h-8 text-[#538d22]" />
      </div>
      <h3 className="text-lg font-black text-[#143601] mb-1">{title}</h3>
      <p className="text-xs font-medium text-[#4b633d] max-w-md mb-4 leading-relaxed">
        {description}
      </p>
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="px-5 py-2.5 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold text-xs shadow-md shadow-[#143601]/20 transition-all hover:scale-105 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4 text-[#aad576]" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
