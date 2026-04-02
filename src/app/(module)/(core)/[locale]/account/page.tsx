import ProtectedRoute from "@/app/ui/protected-route";
import { Metadata } from "next";
import SectionBasicInformation from "../../ui/account/SectionBasicInformation";
import SectionAddressBook from "../../ui/account/SectionAddressBook";
import { cn } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Account"
}

const AccountPage = async () => {
  return (
    <ProtectedRoute>
      <div className="w-full h-full pt-16 relative flex flex-col overflow-hidden">
        <div className="flex-auto p-3 w-full mx-auto overflow-hidden relative flex flex-col">
          <div className="flex-auto bg-white/60 backdrop-blur-md border border-white rounded-lg overflow-auto relative">
            {/* Account Center Header */}
            <div className={cn([
              "p-3 w-full h-12 text-center rounded-b-lg bg-white sticky top-0 left-0 z-10 shadow-md",
              "lg:max-w-80 lg:rounded-bl-none"
            ])}>
              <span className="uppercase text-black font-bold">Account Center</span>
            </div>

            {/* Account Center Content */}
            <div className="p-3 w-full h-auto">
              {/* Section basic information */}
              <SectionBasicInformation />

              {/* Section Address Book */}
              <SectionAddressBook />
              <SectionAddressBook />
              <SectionAddressBook />
              <SectionAddressBook />
              <SectionAddressBook />
              <SectionAddressBook />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AccountPage;
