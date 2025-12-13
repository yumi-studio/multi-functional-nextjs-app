import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/app/ui/buttons";

export default function Complete() {
  const t = useTranslations();
  return (
    <>
      <div className="m-auto w-[90%] h-auto max-w-80 bg-white px-3 rounded-lg border border-gray-900 text-center">
        <div className="my-2">
          <FontAwesomeIcon icon={faCircleCheck} size="5x" color="green"/>
        </div>
        <div className="my-2">{t("signup.complete")}</div>
        <Button className="my-2">
          <Link href={"/signin"}>{t("signup.to_login")}</Link>
        </Button>
      </div>
    </>
  )
}