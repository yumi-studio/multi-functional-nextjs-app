import { redirect } from "next/navigation";
import { HOME_URL } from "@/app/lib/url_paths";

export default function Home() {
  redirect(HOME_URL);
}
