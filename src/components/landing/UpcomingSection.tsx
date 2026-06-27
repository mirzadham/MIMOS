"use client";

import React from "react";
import { Calendar, Bell, ArrowRight, Laptop, Award, Users } from "lucide-react";
import Link from "next/link";

interface TrainingItem {
  id: string;
  title: string;
  dates: string;
  location: string;
  price: string;
  slug: string;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  desc: string;
}

export default function UpcomingSection() {
  const upcomingTrainings: TrainingItem[] = [
    {
      id: "prog-1",
      title: "Advanced Wafer Fabrication & Lithography",
      dates: "15th - 19th July 2026",
      location: "STC Cleanroom Lab, Bukit Jalil",
      price: "RM 4,500 / pax (HRD Corp claimable)",
      slug: "advanced-wafer-fab"
    },
    {
      id: "prog-3",
      title: "Generative AI & LLM Deployment in Enterprise",
      dates: "10th - 14th August 2026",
      location: "5G & AI Innovation Hub, TPM Bukit Jalil",
      price: "RM 3,500 / pax (HRD Corp claimable)",
      slug: "generative-ai-llm"
    },
    {
      id: "prog-2",
      title: "IC Design & Layout Verification",
      dates: "24th - 28th August 2026",
      location: "MIMOS STC Lab, Bukit Jalil",
      price: "RM 4,800 / pax (HRD Corp claimable)",
      slug: "ic-design-layout"
    }
  ];

  const upcomingEvents: EventItem[] = [
    {
      id: "event-1",
      title: "Semiconductor Workforce Development Briefing",
      date: "12th July 2026",
      time: "10:00 AM - 11:30 AM",
      type: "Webinar",
      desc: "Briefing for HR leaders on utilizing HRD Corp levies for deep-tech upskilling programs."
    },
    {
      id: "event-2",
      title: "MIMOS Academy Open Day & Lab Tour",
      date: "05th August 2026",
      time: "09:00 AM - 04:00 PM",
      type: "Physical Event",
      desc: "Get direct access to preview our Semiconductor Cleanrooms and 5G Innovation labs."
    }
  ];

  return (
    <section className="border-b border-slate-100 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* Left Column: Upcoming Trainings */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Laptop className="h-5 w-5" />
              </div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Upcoming Trainings
              </h2>
            </div>
            
            <p className="text-sm text-slate-500 max-w-xl font-body">
              Enroll in our upcoming deep-tech professional programs led by research engineers inside national applied research laboratories.
            </p>

            <div className="mt-8 space-y-4">
              {upcomingTrainings.map((training) => (
                <div 
                  key={training.id}
                  className="group relative rounded-xl border border-slate-200 p-5 bg-slate-50 hover:bg-white hover:border-primary/20 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                        Physical Course
                      </span>
                      <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {training.title}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {training.dates}
                        </span>
                        <span>•</span>
                        <span>{training.location}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-400">
                        {training.price}
                      </p>
                    </div>
                    
                    <div className="shrink-0">
                      <Link
                        href={`/programs/${training.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Upcoming Events */}
          <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-slate-100 lg:pl-12">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bell className="h-5 w-5" />
              </div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Upcoming Events
              </h2>
            </div>

            <p className="text-sm text-slate-500 font-body">
              Join our interactive technology briefings, webinar series, and open lab tours designed for industrial partners.
            </p>

            <div className="mt-8 space-y-4">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id}
                  className="rounded-xl border border-slate-200 p-5 bg-white hover:border-primary/20 hover:shadow-sm transition-all duration-300"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-gold/10 px-2.5 py-0.5 text-[10px] font-bold text-gold">
                        {event.type}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {event.date}
                      </span>
                    </div>
                    
                    <h3 className="font-heading text-sm font-bold text-foreground">
                      {event.title}
                    </h3>
                    
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {event.desc}
                    </p>

                    <div className="pt-2 text-xs text-slate-400">
                      Time: <span className="font-semibold text-slate-600">{event.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* General CTA Box */}
            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent p-5 border border-primary/10 mt-6 text-center space-y-3">
              <h4 className="font-heading text-xs font-bold text-foreground uppercase tracking-wider">
                Looking for customized training?
              </h4>
              <p className="text-xs text-slate-500">
                Contact our advisory team to build a custom deep-tech syllabus claimable under HRD Corp.
              </p>
              <Link
                href="/contact"
                className="inline-block text-xs font-bold text-primary hover:underline"
              >
                Inquire now →
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
