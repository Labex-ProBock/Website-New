// TODO: POST body also sent to BlueWave CRM via /api/lead

"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Check, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

/* ── Country dial codes ─────────────────────────────────────────── */
const DIAL_CODES = [
  { code: "ZA", dial: "+27",  name: "South Africa",  flag: "🇿🇦" },
  { code: "BW", dial: "+267", name: "Botswana",       flag: "🇧🇼" },
  { code: "ZW", dial: "+263", name: "Zimbabwe",       flag: "🇿🇼" },
  { code: "NA", dial: "+264", name: "Namibia",        flag: "🇳🇦" },
  { code: "MZ", dial: "+258", name: "Mozambique",     flag: "🇲🇿" },
  { code: "ZM", dial: "+260", name: "Zambia",         flag: "🇿🇲" },
  { code: "LS", dial: "+266", name: "Lesotho",        flag: "🇱🇸" },
  { code: "SZ", dial: "+268", name: "Eswatini",       flag: "🇸🇿" },
  { code: "KE", dial: "+254", name: "Kenya",          flag: "🇰🇪" },
  { code: "NG", dial: "+234", name: "Nigeria",        flag: "🇳🇬" },
  { code: "GH", dial: "+233", name: "Ghana",          flag: "🇬🇭" },
  { code: "TZ", dial: "+255", name: "Tanzania",       flag: "🇹🇿" },
  { code: "UG", dial: "+256", name: "Uganda",         flag: "🇺🇬" },
  { code: "GB", dial: "+44",  name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", dial: "+1",   name: "United States",  flag: "🇺🇸" },
  { code: "AU", dial: "+61",  name: "Australia",      flag: "🇦🇺" },
  { code: "DE", dial: "+49",  name: "Germany",        flag: "🇩🇪" },
  { code: "NL", dial: "+31",  name: "Netherlands",    flag: "🇳🇱" },
  { code: "IN", dial: "+91",  name: "India",          flag: "🇮🇳" },
  { code: "CN", dial: "+86",  name: "China",          flag: "🇨🇳" },
];

/* ── Schema ─────────────────────────────────────────────────────── */
const schema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  company:  z.string().min(2, "Company must be at least 2 characters"),
  email:    z.string().email("Please enter a valid email address"),
  phone:    z.string().min(6,  "Please enter a valid phone number"),
  interest: z.string().min(5,  "Please describe what you're looking for"),
});

type LeadFormValues = z.infer<typeof schema>;

interface LeadFormProps {
  onSuccess?: () => void;
}

/* ── Shared styles ──────────────────────────────────────────────── */
const inputClass =
  "w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-orange)] text-white placeholder-[var(--color-muted)] outline-none text-sm transition-colors";

const inputStyle: React.CSSProperties = {
  paddingTop: "0.75rem",
  paddingBottom: "0.75rem",
  paddingLeft: "1.5rem",
  paddingRight: "1rem",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.68rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.42)",
  marginBottom: "0.35rem",
};

/* ── Inner form ─────────────────────────────────────────────────── */
function LeadFormInner({ onSuccess }: LeadFormProps) {
  const searchParams = useSearchParams();
  const [utms, setUtms] = useState({ utm_source: "", utm_medium: "", utm_campaign: "" });
  const [submitted, setSubmitted] = useState(false);

  /* Dial code combobox */
  const [selectedCountry, setSelectedCountry] = useState(DIAL_CODES[0]);
  const [dialOpen, setDialOpen]   = useState(false);
  const [dialSearch, setDialSearch] = useState("");
  const dialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (dialRef.current && !dialRef.current.contains(e.target as Node)) {
        setDialOpen(false);
        setDialSearch("");
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  const filteredDials = dialSearch
    ? DIAL_CODES.filter(
        (c) =>
          c.name.toLowerCase().includes(dialSearch.toLowerCase()) ||
          c.dial.includes(dialSearch)
      )
    : DIAL_CODES;

  useEffect(() => {
    setUtms({
      utm_source:   searchParams.get("utm_source")   ?? "",
      utm_medium:   searchParams.get("utm_medium")   ?? "",
      utm_campaign: searchParams.get("utm_campaign") ?? "",
    });
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: LeadFormValues) {
    const payload = {
      ...data,
      ...utms,
      phone: `${selectedCountry.dial} ${data.phone}`,
    };
    try {
      const res = await fetch("/api/lead", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitted(true);
        onSuccess?.();
      }
    } catch (err) {
      console.error("Lead submission error:", err);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
        <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center">
          <Check size={28} className="text-green-400" />
        </div>
        <p className="text-white font-semibold text-lg">
          Thank you — we&apos;ll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">

        {/* Name */}
        <div>
          <label style={labelStyle}>Full name</label>
          <input
            {...register("name")}
            placeholder="e.g. Sarah Nkosi"
            className={inputClass}
            style={inputStyle}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Company */}
        <div>
          <label style={labelStyle}>Company</label>
          <input
            {...register("company")}
            placeholder="e.g. Wits Lab"
            className={inputClass}
            style={inputStyle}
          />
          {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company.message}</p>}
        </div>

        {/* Email */}
        <div className="sm:col-span-2">
          <label style={labelStyle}>Email address</label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@organisation.co.za"
            className={inputClass}
            style={inputStyle}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone with dial-code combobox */}
        <div className="sm:col-span-2">
          <label style={labelStyle}>Phone number</label>
          <div ref={dialRef} style={{ position: "relative" }}>
            {/* Combined pill: trigger + input */}
            <div
              className="focus-within:border-[var(--color-orange)]"
              style={{
                display: "flex",
                borderRadius: "0.75rem",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface-2)",
                overflow: "visible",
                transition: "border-color 0.2s",
              }}
            >
              {/* Dial code trigger */}
              <button
                type="button"
                onClick={() => setDialOpen(!dialOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0 0.875rem",
                  background: "none",
                  border: "none",
                  borderRight: "1px solid var(--color-border)",
                  color: "#fff",
                  fontSize: "0.82rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>{selectedCountry.flag}</span>
                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.8rem" }}>
                  {selectedCountry.dial}
                </span>
                <ChevronDown
                  size={11}
                  style={{
                    color: "var(--color-muted)",
                    transition: "transform 0.15s",
                    transform: dialOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              {/* Number input */}
              <input
                {...register("phone")}
                type="tel"
                placeholder="000 000 0000"
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  color: "#fff",
                  fontSize: "0.875rem",
                  minWidth: 0,
                }}
                className="placeholder-[var(--color-muted)]"
              />
            </div>

            {/* Dropdown */}
            {dialOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 5px)",
                  left: 0,
                  zIndex: 100,
                  width: "280px",
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.875rem",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.55)",
                  overflow: "hidden",
                }}
              >
                {/* Search */}
                <div style={{ padding: "0.625rem" }}>
                  <input
                    type="text"
                    value={dialSearch}
                    onChange={(e) => setDialSearch(e.target.value)}
                    placeholder="Search country or code…"
                    autoFocus
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      backgroundColor: "var(--color-surface-2)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.5rem",
                      color: "#fff",
                      fontSize: "0.78rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    className="placeholder-[var(--color-muted)]"
                  />
                </div>

                {/* Country list */}
                <div style={{ maxHeight: "216px", overflowY: "auto" }}>
                  {filteredDials.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => {
                        setSelectedCountry(country);
                        setDialOpen(false);
                        setDialSearch("");
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.55rem 0.875rem",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: selectedCountry.code === country.code
                          ? "var(--color-orange)"
                          : "#fff",
                        fontSize: "0.82rem",
                        textAlign: "left",
                        transition: "background-color 0.12s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "var(--color-surface-2)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "transparent";
                      }}
                    >
                      <span style={{ fontSize: "1rem", flexShrink: 0, lineHeight: 1 }}>
                        {country.flag}
                      </span>
                      <span style={{ flex: 1 }}>{country.name}</span>
                      <span style={{ color: "var(--color-muted)", fontSize: "0.75rem", flexShrink: 0 }}>
                        {country.dial}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        {/* Interest */}
        <div className="sm:col-span-2">
          <label style={labelStyle}>What are you looking for?</label>
          <textarea
            {...register("interest")}
            rows={3}
            placeholder="e.g. centrifuge, autoclave, pipetting station…"
            className={cn(inputClass, "resize-none")}
            style={inputStyle}
          />
          {errors.interest && <p className="text-red-400 text-xs mt-1">{errors.interest.message}</p>}
        </div>

        {/* Hidden UTM */}
        <input type="hidden" value={utms.utm_source}   {...register("utm_source"   as never)} />
        <input type="hidden" value={utms.utm_medium}   {...register("utm_medium"   as never)} />
        <input type="hidden" value={utms.utm_campaign} {...register("utm_campaign" as never)} />

        {/* Submit */}
        <div className="sm:col-span-2" style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              minWidth: "240px",
              padding: "0.875rem 2rem",
              borderRadius: "0.75rem",
              backgroundColor: "var(--color-orange)",
              color: "#fff",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: isSubmitting ? "default" : "pointer",
              opacity: isSubmitting ? 0.6 : 1,
              border: "none",
              transition: "opacity 0.2s",
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending…
              </>
            ) : (
              "Send enquiry"
            )}
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs text-[var(--color-muted)]">
        Your details are collected for sales purposes only. POPIA compliant.
      </p>
    </form>
  );
}

export default function LeadForm(props: LeadFormProps) {
  return (
    <Suspense fallback={null}>
      <LeadFormInner {...props} />
    </Suspense>
  );
}
