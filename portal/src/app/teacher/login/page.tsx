import { redirect } from "next/navigation";

// Legacy route — the unified /login page now handles teacher sign-in
// (look for the "Teacher sign-in" card at the bottom).
export default function TeacherLoginRedirect() {
  redirect("/login?teacher=1");
}
