"use client";

import { useState } from "react";

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string | null;
  initials: string;
}

export default function TeamMemberCardClient({ member }: { member: TeamMember }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Aspect 3/4 Image Container with Soft MIMOS Orchid Gradient Backing */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-b from-brand-light-start to-brand-light-end">
        {!imgError && member.imageUrl ? (
          <img
            src={member.imageUrl}
            alt={member.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 select-none relative">
            <span className="font-heading text-3xl font-black tracking-widest text-[#a72190]/25">
              {member.initials}
            </span>
            <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-primary/20" />
          </div>
        )}
      </div>

      {/* Typography placed strictly below the image frame, matching user's reference design */}
      <div className="mt-4 flex flex-col">
        <span className="font-heading text-sm font-extrabold text-slate-900">
          {member.name}
        </span>
        <span className="mt-0.5 font-body text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {member.role}
        </span>
      </div>
    </div>
  );
}
