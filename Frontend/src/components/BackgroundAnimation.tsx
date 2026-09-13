import React from 'react';

export const BackgroundAnimation: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* Soft Ambient Top-Right Glowing Gradient Orb */}
      <div className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#aad576]/25 via-[#73a942]/10 to-transparent blur-3xl opacity-70 animate-ambient-orb-1" />

      {/* Soft Ambient Bottom-Left Glowing Gradient Orb */}
      <div className="absolute -bottom-40 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#538d22]/15 via-[#f4f8f0] to-transparent blur-3xl opacity-60 animate-ambient-orb-2" />

      {/* Subtle Central Light Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-emerald-100/20 via-[#aad576]/10 to-transparent blur-3xl opacity-40" />

      {/* Micro Floating Data / Leaf Nodes */}
      <div className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-[#538d22]/20 blur-xs animate-particle-drift" />
      <div className="absolute top-2/3 left-1/5 w-4 h-4 rounded-full bg-[#73a942]/20 blur-xs animate-particle-drift [animation-delay:2s]" />
      <div className="absolute bottom-1/4 right-1/3 w-2.5 h-2.5 rounded-full bg-[#aad576]/30 blur-xs animate-particle-drift [animation-delay:4s]" />

      {/* Faint Structural Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#538d22_0.75px,transparent_0.75px)] [background-size:32px_32px] opacity-[0.035]" />
    </div>
  );
};

export default BackgroundAnimation;
