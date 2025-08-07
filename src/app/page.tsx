// app/page.tsx

import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/login");
  return null; // Redirects handled, no UI needed here
}
