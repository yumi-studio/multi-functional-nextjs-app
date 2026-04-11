import ProtectedRoute from "../../ui/protected-route";
import View from "./view";

const Page = async ({ params, searchParams }: PageProps<'/[locale]/freechat'>) => {
  return (
    <ProtectedRoute skipRedirect>
      <View />
    </ProtectedRoute>
  )
}

export default Page;
