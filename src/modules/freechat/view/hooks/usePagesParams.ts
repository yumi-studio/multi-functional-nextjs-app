import { useParams } from "next/navigation";

export const useRoomParams = () => {
  const { id } = useParams<{ id: string }>();
  return { id };
}