"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { Check, Sparkles, ArrowRight, Info, Nfc, Loader2 } from "lucide-react";

/* ──────────────────────────────────────────────
   Built on Glamlink's own theme tokens (globals.css):
     bg-primary / text-primary            →