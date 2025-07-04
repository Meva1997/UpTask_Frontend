import { useQuery } from "@tanstack/react-query"
import { getUser } from "@/api/AuthAPI"

export const useAuth = () => {

  const {data , isError, isLoading} = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    retry: 1,
    refetchOnWindowFocus: false, // Do not refetch when the window is focused
  })


  return {data , isError, isLoading}
}