import Link from "next/link";

export default function Page() {
  return (
    <>
      <div>Fake Youtube</div>
      <Link href={"/home"}>Back to Home</Link>
    </>
  )
}