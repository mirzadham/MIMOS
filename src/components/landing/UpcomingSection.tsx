"use client";

import React from "react";
import { Calendar, Bell, ArrowRight, Clock, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface TrainingItem {
  id: string;
  title: string;
  dates: string;
  location: string;
  price: string;
  slug: string;
  category: string;
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
      title: "Semiconductor Wafer Fabrication",
      dates: "Scheduled Soon",
      location: "MIMOS Berhad, Bukit Jalil",
      price: "HRD Corp Claimable",
      slug: "semiconductor-wafer-fabrication",
      category: "Semiconductors"
    },
    {
      id: "prog-6",
      title: "Certified Data Science Practitioner",
      dates: "July 2026",
      location: "MIMOS Berhad, Bukit Jalil",
      price: "RM 2,800 / pax (HRD Corp Claimable)",
      slug: "certified-data-science-practitioner",
      category: "Artificial Intelligence"
    },
    {
      id: "prog-10",
      title: "Cybersecurity Awareness",
      dates: "Scheduled Soon",
      location: "MIMOS Berhad, Bukit Jalil",
      price: "RM 1,000 / pax (HRD Corp Claimable)",
      slug: "cybersecurity-awareness",
      category: "Cybersecurity"
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

  const listContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <section className="border-b border-slate-200/60 bg-white py-20 sm:py-28 relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute right-1/4 top-1/4 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 items-start">
          
          {/* Left Column: Upcoming Trainings */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 border border-primary/10 px-3 py-1 text-xs font-bold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next Intake Schedules</span>
              </div>
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Upcoming Trainings
              </h2>
              <p className="text-sm sm:text-md text-slate-500 leading-relaxed max-w-2xl font-body">
                Enroll in our upcoming deep-tech professional programs led by research engineers inside national applied R&D laboratories.
              </p>
            </div>

            <motion.div 
              variants={listContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-6"
            >
              {upcomingTrainings.map((training) => (
                <motion.div 
                  key={training.id}
                  variants={itemVariants}
                  className="group relative rounded-2xl border border-slate-200/80 p-6 bg-white hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center rounded-md bg-primary/5 border border-primary/10 px-2.5 py-0.5 text-[9px] font-bold text-primary tracking-wide uppercase">
                          {training.category}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
                          <MapPin className="h-3 w-3" />
                          {training.location}
                        </span>
                      </div>
                      
                      <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-primary transition-colors duration-200">
                        {training.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 rounded-md px-2.5 py-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>Intake: {training.dates}</span>
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">
                          {training.price}
                        </span>
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex items-center">
                      <Link
                        href={`/programs/${training.slug}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200/80 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                      >
                        <span>View Syllabus</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Upcoming Events */}
          <div className="lg:col-span-5 space-y-8 lg:border-l lg:border-slate-200/80 lg:pl-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200/80 px-3 py-1 text-xs font-bold text-slate-600">
                <Bell className="h-3.5 w-3.5 text-slate-400" />
                <span>Ecosystem Connect</span>
              </div>
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Academy Events
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed font-body">
                Join our interactive technology briefings, webinar series, and open lab tours designed for industrial partners.
              </p>
            </div>

            <motion.div 
              variants={listContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-6"
            >
              {upcomingEvents.map((event) => (
                <motion.div 
                  key={event.id}
                  variants={itemVariants}
                  className="group relative rounded-2xl border border-slate-200/85 p-6 bg-slate-50/40 hover:bg-white hover:border-primary/20 transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <span className="inline-flex items-center rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                        {event.type}
                      </span>
                      <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md">
                        {event.date}
                      </span>
                    </div>
                    
                    <h3 className="font-heading text-md font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    
                    <p className="text-xs text-slate-500 leading-relaxed font-body">
                      {event.desc}
                    </p>

                    <div className="flex items-center gap-3 pt-2 text-[11px] font-semibold text-slate-400 border-t border-slate-200/40">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>{event.time}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* General CTA Box */}
              <motion.div 
                variants={itemVariants}
                className="rounded-2xl bg-primary/5 p-6 border border-primary/10 space-y-4 text-center"
              >
                <h4 className="font-heading text-xs font-bold text-primary uppercase tracking-widest">
                  Looking for Customized Training?
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  We build custom corporate upskilling curricula tailored for your engineering teams, claimable under HRD Corp.
                </p>
                <div className="pt-1">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                  >
                    <span>Inquire Advisory Team</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
