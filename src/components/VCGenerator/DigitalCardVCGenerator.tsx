"use client";
import { SITE_URL } from "@/lib/config";
import React, { useState } from "react";
import {QRCode} from "react-qr-code";
const BASE_URL = `${SITE_URL}/card/`;

const THEME_COLORS = [
  { name: "Teal", from: "#0d9488", to: "#0f766e" },
  { name: "Rose", from: "#f43f5e", to: "#e11d48" },
  { name: "Violet", from: "#7c3aed", to: "#6d28d9" },
  { name: "Sky", from: "#0284c7", to: "#0369a1" },
];

export default function DigitalCard() {
  const [form, setForm] = useState({
    username: "bhavya",
    name: "Bhavya Soni",
    title: "Software Developer",
    phone: "9876543210",
    email: "bhavya@email.com",
    company: "My Company",
    website: SITE_URL,
  });

  const [theme, setTheme] = useState(THEME_COLORS[0]);

  const publicUrl = `${BASE_URL}${form.username}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const initials = form.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-card/80 backdrop-blur border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Digital Card Builder</h1>
        <span className="text-xs bg-muted px-3 py-1 rounded-full">
          Live Preview
        </span>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 p-6">

        {/* LEFT PANEL */}
        <div className="space-y-6">
          
          {/* CARD SETTINGS */}
          <div className="bg-card p-6 rounded-2xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Profile Info</h2>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "username", label: "Username" },
                { name: "name", label: "Full Name" },
                { name: "title", label: "Job Title" },
                { name: "phone", label: "Phone" },
                { name: "email", label: "Email" },
                { name: "company", label: "Company" },
                { name: "website", label: "Website" },
              ].map((f) => (
                <div key={f.name} className="col-span-2">
                  <label className="text-xs text-muted-foreground">{f.label}</label>
                  <input
                    name={f.name}
                    value={(form as any)[f.name]}
                    onChange={handleChange}
                    className="w-full mt-1 border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-black/10 outline-none transition"
                  />
                </div>
              ))}
            </div>
          </div>

       

        </div>

        {/* RIGHT PANEL (STICKY PREVIEW) */}
        <div className="flex justify-center">
          <div className="sticky top-24 w-full max-w-sm">

            <div className="bg-card rounded-3xl shadow-xl overflow-hidden transition-all hover:shadow-2xl">
              
              {/* Banner */}
              <div
                className="h-32"
                style={{
                  background: "#24bbcb",
                }}
              />

              <div className="p-6 -mt-12">
                
                {/* Avatar + QR */}
                <div className="flex justify-between items-end">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                    style={{
                      background: "#24bbcb",
                    }}
                  >
                    {initials}
                  </div>

                  <div className="bg-card p-2 rounded-xl shadow">
                    <QRCode value={publicUrl} size={70} />
                  </div>
                </div>

                {/* NAME */}
                <h2 className="text-2xl font-semibold mt-4">
                  {form.name}
                </h2>

                <p className="text-muted-foreground text-sm">
                  {form.title} · {form.company}
                </p>

                {/* INFO */}
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    📱 <span>{form.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    ✉️ <span>{form.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    🌐 <span>{form.website}</span>
                  </div>
                </div>

                {/* ACTIONS */}
                {/* <div className="mt-6 grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${form.phone}`}
                    className="text-center py-2.5 rounded-xl border hover:bg-muted transition"
                  >
                    Call
                  </a>
                  <a
                    href={`mailto:${form.email}`}
                    className="text-center py-2.5 rounded-xl border hover:bg-muted transition"
                  >
                    Email
                  </a>
                </div> */}

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}