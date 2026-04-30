import View from "@/app/[locale]/freechat/view";
import ProtectedRoute from "@/modules/freechat/view/ui/ProtectedRoute";

const Page = async ({ params, searchParams }: PageProps<'/[locale]/freechat'>) => {
  return (
    <ProtectedRoute skipRedirect>
      <View />
    </ProtectedRoute>
  )
}

export default Page;
