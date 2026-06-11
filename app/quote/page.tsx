import { redirect } from "next/navigation";

// The in-site quote wizard has been retired. Quoting now happens in the
// embedded ProBokTech assistant. Existing "Request a quote" links (nav,
// footer, hero, industries, newsletter) land here and forward on.
export default function QuotePage() {
  redirect("/assistant");
}
