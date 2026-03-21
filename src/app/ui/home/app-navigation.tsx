"use client";

import { FAKEBOOK_URL } from "@/app/lib/url_paths";
import { Button } from "@mui/material";
import Link from "next/link";

type APP_ITEM = {
  title: string;
  url: string;
};

export default function AppNavigation() {

  const APP_LIST: APP_ITEM[] = [
    { title: "Fakebook", url: FAKEBOOK_URL },
    { title: "Fakebook", url: FAKEBOOK_URL },
    { title: "Fakebook", url: FAKEBOOK_URL },
    { title: "Fakebook", url: FAKEBOOK_URL },
    { title: "Fakebook", url: FAKEBOOK_URL },
    { title: "Fakebook", url: FAKEBOOK_URL },
    { title: "Fakebook", url: FAKEBOOK_URL },
    { title: "Fakebook", url: FAKEBOOK_URL },
    { title: "Fakebook", url: FAKEBOOK_URL },
    { title: "Fakebook", url: FAKEBOOK_URL },
    { title: "Fakebook", url: FAKEBOOK_URL },
    { title: "Fakebook", url: FAKEBOOK_URL },
  ];

  return (
    <div className="flex flex-wrap justify-start items-start gap-2 py-2">
      {APP_LIST &&
        APP_LIST.map((item, index) => (
          <Button
            key={index} variant="outlined" color="secondary" fullWidth>
            <Link href={item.url}>
              {item.title}
            </Link>
          </Button>
        ))}
    </div>
  )
}
