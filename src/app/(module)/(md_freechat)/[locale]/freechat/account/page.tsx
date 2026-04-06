import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account"
}

const AccountPage = async () => {
  return (
    <div className="w-full h-full max-w-7xl mx-auto bg-inherit border-x-2 border-(--fc-border) relative flex flex-col">
      <h2 className="px-3 py-2 border-b-2 border-b-(--fc-border) text-xl font-bold">Account Dashboard</h2>
    </div>
  )
}

export default AccountPage;
