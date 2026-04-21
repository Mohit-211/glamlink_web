"use client"
import React, { useState } from "react";

const VCGenerator = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    website: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateVCF = () => {
    const vcfContent = `
BEGIN:VCARD
VERSION:3.0
N:${form.lastName};${form.firstName}
FN:${form.firstName} ${form.lastName}
ORG:${form.company}
TEL;TYPE=CELL:${form.phone}
EMAIL:${form.email}
URL:${form.website}
END:VCARD
`.trim();

    const blob = new Blob([vcfContent], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${form.firstName || "contact"}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef4ff] p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-4">

        <h2 className="text-xl font-bold text-center">VCF Generator</h2>

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          type="text"
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          type="text"
          name="website"
          placeholder="Website"
          value={form.website}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
        />

        <button
          onClick={generateVCF}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg font-semibold"
        >
          Download VCF
        </button>
      </div>
    </div>
  );
};

export default VCGenerator;