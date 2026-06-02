"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";
import { industries } from "@/content/industries";
import { productCategories } from "@/content/products";
import { cn } from "@/lib/utils";

// ---------- Schema ----------
const schema = z.object({
  // Step 1
  category: z.string().min(1, "Please select a category"),
  equipmentDescription: z.string().min(5, "Please describe the equipment or application"),
  // Step 2
  quantity: z.coerce.number({ invalid_type_error: "Enter a number" }).min(1, "Quantity must be at least 1"),
  timeline: z.string().min(1, "Please select a timeline"),
  industry: z.string().min(1, "Please select an industry"),
  budget: z.string().min(1, "Please select a budget range"),
  // Step 3
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().min(2, "Company must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
});

type QuoteFormValues = z.infer<typeof schema>;

// ---------- Constants ----------
const STEPS = ["Equipment", "Requirements", "Your Details"] as const;

const TIMELINES = [
  "ASAP / Within 1 month",
  "1–3 months",
  "3–6 months",
  "Planning stage",
];

const BUDGETS = [
  "Under R10,000",
  "R10k–R50k",
  "R50k–R200k",
  "R200k+",
  "Prefer not to say",
];

// ---------- Helpers ----------
const inputClass =
  "w-full px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-orange)] text-white placeholder-[var(--color-muted)] outline-none text-sm transition-colors";

const selectClass = cn(
  inputClass,
  "appearance-none cursor-pointer"
);

// ---------- Step indicator ----------
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center flex-1">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
                  done
                    ? "bg-[var(--color-orange)] border-[var(--color-orange)] text-white"
                    : active
                    ? "bg-[var(--color-orange)] border-[var(--color-orange)] text-white"
                    : "bg-transparent border-[var(--color-border)] text-[var(--color-muted)]"
                )}
              >
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  active ? "text-[var(--color-orange)]" : done ? "text-[var(--color-orange)]" : "text-[var(--color-muted)]"
                )}
              >
                {label}
              </span>
            </div>

            {/* Connector line (not after last) */}
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-3 mb-5 transition-colors"
                style={{ background: i < current ? "var(--color-orange)" : "var(--color-border)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------- Main component ----------
export default function QuoteWizard() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const STEP_FIELDS: (keyof QuoteFormValues)[][] = [
    ["category", "equipmentDescription"],
    ["quantity", "timeline", "industry", "budget"],
    ["name", "company", "email", "phone"],
  ];

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (!valid) return;
    setDirection(1);
    setStep((s) => s + 1);
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => s - 1);
  }

  async function onSubmit(data: QuoteFormValues) {
    try {
      // TODO: Replace form handler with AI quote agent integration once built
      await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("Quote submission error:", err);
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-orange)]/15 flex items-center justify-center">
          <Check size={30} className="text-[var(--color-orange)]" />
        </div>
        <div>
          <h3 className="text-white font-bold text-xl mb-2">Quote request submitted!</h3>
          <p className="text-[var(--color-muted)] text-sm max-w-xs mx-auto">
            A member of our team will respond within 1 business day.
          </p>
        </div>
      </div>
    );
  }

  const variants = {
    enter: (dir: number) => ({ x: dir * 50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -50, opacity: 0 }),
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepIndicator current={step} />

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 && (
            <motion.div
              key="step-0"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex flex-col gap-4"
            >
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  What equipment or category are you interested in?
                </label>
                <select {...register("category")} className={selectClass} defaultValue="">
                  <option value="" disabled>Select a category…</option>
                  {productCategories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                  <option value="other">Other / not sure</option>
                </select>
                {errors.category && (
                  <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Describe the equipment or application
                </label>
                <textarea
                  {...register("equipmentDescription")}
                  rows={3}
                  placeholder="e.g. analytical balance for pharmaceutical QC, 0.1 mg readability…"
                  className={cn(inputClass, "resize-none")}
                />
                {errors.equipmentDescription && (
                  <p className="text-red-400 text-xs mt-1">{errors.equipmentDescription.message}</p>
                )}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex flex-col gap-4"
            >
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Approximate quantity
                </label>
                <input
                  {...register("quantity")}
                  type="number"
                  min={1}
                  placeholder="e.g. 2"
                  className={inputClass}
                />
                {errors.quantity && (
                  <p className="text-red-400 text-xs mt-1">{errors.quantity.message}</p>
                )}
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Target timeline
                </label>
                <select {...register("timeline")} className={selectClass} defaultValue="">
                  <option value="" disabled>Select timeline…</option>
                  {TIMELINES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.timeline && (
                  <p className="text-red-400 text-xs mt-1">{errors.timeline.message}</p>
                )}
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Industry
                </label>
                <select {...register("industry")} className={selectClass} defaultValue="">
                  <option value="" disabled>Select industry…</option>
                  {industries.map((ind) => (
                    <option key={ind.slug} value={ind.slug}>{ind.name}</option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="text-red-400 text-xs mt-1">{errors.industry.message}</p>
                )}
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Budget range (ZAR)
                </label>
                <select {...register("budget")} className={selectClass} defaultValue="">
                  <option value="" disabled>Select budget…</option>
                  {BUDGETS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                {errors.budget && (
                  <p className="text-red-400 text-xs mt-1">{errors.budget.message}</p>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex flex-col gap-4"
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Full name</label>
                <input {...register("name")} placeholder="Jane Dlamini" className={inputClass} />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Company</label>
                <input {...register("company")} placeholder="Acme Pharmaceuticals" className={inputClass} />
                {errors.company && (
                  <p className="text-red-400 text-xs mt-1">{errors.company.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email address</label>
                <input {...register("email")} type="email" placeholder="jane@acme.co.za" className={inputClass} />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Phone number</label>
                <input {...register("phone")} type="tel" placeholder="011 000 0000" className={inputClass} />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* POPIA notice */}
              <p className="text-xs text-[var(--color-muted)]">
                Your details are collected for sales purposes only. POPIA compliant.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className={cn("flex mt-8 gap-3", step === 0 ? "justify-end" : "justify-between")}>
        {step > 0 && (
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--color-border)] text-[var(--color-muted)] hover:text-white hover:border-white text-sm font-medium cursor-pointer transition-colors"
          >
            <ChevronLeft size={16} />
            Back
          </button>
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-orange)] hover:bg-[var(--color-orange-deep)] text-white text-sm font-semibold cursor-pointer transition-colors"
          >
            Next
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-orange)] hover:bg-[var(--color-orange-deep)] disabled:opacity-60 text-white text-sm font-semibold cursor-pointer transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                Submit request
                <Check size={16} />
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}
