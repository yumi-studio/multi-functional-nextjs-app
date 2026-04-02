import { HOME_URL } from "@/app/lib/url_paths";
import { redirect } from "next/navigation";

export default function Page() {
  redirect(HOME_URL);
}
