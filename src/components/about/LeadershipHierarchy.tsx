"use client";

import React from "react";
import TeamMemberCardClient from "@/components/about/TeamMemberCardClient";
import { Award, Layers, Users } from "lucide-react";

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string | null;
  initials: string;
  level?: number;
  order?: number;
}

interface LeadershipHierarchyProps {
  members: LeadershipMember[];
}

const TIER_META: Record<number, { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }> = {
  1: {
    title: "Executive Leadership",
    subtitle: "Strategic Direction & Organizational Vision",
    icon: Award,
  },
  2: {
    title: "Senior Leadership & Operations",
    subtitle: "Divisional Leadership & Program Operations",
    icon: Layers,
  },
  3: {
    title: "Program Specialists & Development",
    subtitle: "Talent Development, Partnerships & Technical Execution",
    icon: Users,
  },
};

export default function LeadershipHierarchy({ members }: LeadershipHierarchyProps) {
  if (!members || members.length === 0) {
    return null;
  }

  // Group members strictly by level (default to 1 if level is undefined or null)
  const groupedByLevel = members.reduce<Record<number, LeadershipMember[]>>((acc, member) => {
    const lvl = Number(member.level) > 0 ? Number(member.level) : 1;
    if (!acc[lvl]) acc[lvl] = [];
    acc[lvl].push(member);
    return acc;
  }, {});

  // Sort levels ascending (1, 2, 3...)
  const sortedLevels = Object.keys(groupedByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="relative w-full space-y-16 sm:space-y-20">
      {sortedLevels.map((lvl, lvlIndex) => {
        const levelMembers = groupedByLevel[lvl];
        const meta = TIER_META[lvl] || {
          title: `Leadership Tier ${lvl}`,
          subtitle: "Department Leadership & Execution",
          icon: Users,
        };
        const TierIcon = meta.icon;
        const isTopTier = lvl === 1;

        return (
          <div key={lvl} className="relative flex flex-col items-center">
            {/* Connecting Vertical Stem from Previous Tier on Desktop/Tablet */}
            {lvlIndex > 0 && (
              <div className="hidden sm:flex flex-col items-center -mt-16 sm:-mt-20 mb-10 w-full">
                {/* Vertical connecting line */}
                <div className="w-px h-10 sm:h-12 bg-gradient-to-b from-primary/30 via-primary/20 to-primary/10" />
                {/* Small circular connector hub */}
                <div className="w-2.5 h-2.5 rounded-full border-2 border-primary/30 bg-background shadow-xs -mt-1 z-10" />
              </div>
            )}

            {/* Tier Header / Badge */}
            <div className="flex flex-col items-center text-center mb-8 sm:mb-10 px-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/15 bg-primary/5 text-primary text-[11px] font-semibold tracking-wide uppercase">
                <TierIcon className="w-3.5 h-3.5" />
                <span>{meta.title}</span>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 font-body max-w-md">
                {meta.subtitle}
              </p>
            </div>

            {/* Members Cards Container */}
            {isTopTier ? (
              // Level 1: Prominently centered with subtle highlight frame
              <div className="w-full flex justify-center px-4">
                <div className="w-full max-w-[280px] sm:max-w-[320px] p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-primary/[0.04] to-transparent border border-primary/15 shadow-xs transition-all hover:border-primary/25 hover:shadow-md">
                  <TeamMemberCardClient member={levelMembers[0]} />
                </div>
              </div>
            ) : (
              // Levels 2+: Responsive grid centered with comfortable spacing
              <div className="w-full">
                {/* Horizontal branch line for multi-member tiers on desktop */}
                {levelMembers.length > 1 && (
                  <div className="hidden lg:block relative w-full max-w-4xl mx-auto mb-6">
                    <div className="h-px w-full bg-slate-250/70" />
                    {/* Vertical dropped stems reaching towards cards */}
                    <div className="absolute left-0 top-0 w-px h-3 bg-slate-250/70" />
                    <div className="absolute right-0 top-0 w-px h-3 bg-slate-250/70" />
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-3 bg-slate-250/70" />
                  </div>
                )}

                <div
                  className={`grid gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12 justify-center mx-auto ${
                    levelMembers.length === 1
                      ? "grid-cols-1 max-w-[260px] sm:max-w-[280px]"
                      : levelMembers.length === 2
                      ? "grid-cols-1 sm:grid-cols-2 max-w-2xl"
                      : levelMembers.length === 3
                      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-4xl"
                      : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 max-w-6xl"
                  }`}
                >
                  {levelMembers.map((member) => (
                    <div
                      key={member.id}
                      className="transition-transform duration-200 hover:-translate-y-1"
                    >
                      <TeamMemberCardClient member={member} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
