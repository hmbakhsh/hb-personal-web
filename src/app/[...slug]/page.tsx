import { redirect } from "next/navigation";

// Unknown routes go to the home page instead of a 404.
export default function CatchAll() {
  redirect("/");
}
