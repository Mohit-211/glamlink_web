"use client";
import { SITE_URL } from "@/lib/config";

import { useParams } from "next/navigation";
import { QRCode } from "react-qr-code";
// import QRCode from "react-qr-code";
const PublicCard = () => {
  const params = useParams();
  const username = params?.username as string;

  // 🔥 Replace with API later
  const user = {
    name: "Bhavya Soni",
    title: "Software Developer",
    company: "My Company",
    phone: "9876543210",
    email: "bhavya@email.com",
    website: SITE_URL,
    theme: {
      from: "#0d9488",
      to: "#0f766e",
    },
  };

  const publicUrl = `${SITE_URL}/card/${username}`;

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      
      {/* CARD */}
      <div className="w-full max-w-sm bg-card rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* BANNER */}
        <div
          className="h-32"
          style={{
            background: "#24bbcb",
          }}
        />

        <div className="p-6 -mt-12">
          
          {/* AVATAR + QR */}
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
          <h1 className="text-2xl font-semibold text-foreground mt-4">
            {user.name}
          </h1>

          <p className="text-muted-foreground text-sm">
            {user.title} · {user.company}
          </p>

          {/* INFO */}
          <div className="mt-5 space-y-3 text-sm text-foreground/80">
            <div className="flex items-center gap-2">
              📱 <span>{user.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              ✉️ <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              🌐 <span>{user.website}</span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <a
              href={`tel:${user.phone}`}
              className="text-center py-2.5 rounded-xl border border-border hover:bg-muted transition font-medium"
            >
              📞 Call
            </a>

            <a
              href={`mailto:${user.email}`}
              className="text-center py-2.5 rounded-xl border border-border hover:bg-muted transition font-medium"
            >
              📧 Email
            </a>
          </div>

          {/* SAVE CONTACT */}
          <button
            onClick={() => {
              const vcf = `BEGIN:VCARD\nVERSION:3.0\nFN:${user.name}\nTITLE:${user.title}\nTEL:${user.phone}\nEMAIL:${user.email}\nURL:${publicUrl}\nEND:VCARD`;
              const blob = new Blob([vcf], { type: "text/vcard" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = `${user.name}.vcf`;
              a.click();
            }}
            className="mt-4 w-full py-3 rounded-xl text-white font-semibold shadow-md hover:opacity-90 transition"
            style={{
              background: "#24bbcb",
            }}
          >
            📥 Save Contact
          </button>
        </div>
      </div>

      {/* OPTIONAL FOOTER */}
      <div className="absolute bottom-4 text-xs text-muted-foreground">
        Powered by <span className="font-semibold text-white">Glamlink</span>
      </div>
    </div>
  );
};

export default PublicCard;