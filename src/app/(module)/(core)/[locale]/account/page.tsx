import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account"
}

const AccountPage = async () => {
  return (
    <div className="w-full h-full pt-16 relative flex flex-col">
      <div className="mt-3 p-3 w-full max-w-3xl mx-auto bg-white rounded-[0.5rem]">
        <div className="font-bold mb-2 uppercase text-center shadow-md shadow-gray-300 rounded-[0.5rem] p-3 ">Account Information</div>
        <div className="flex gap-3">
          
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
