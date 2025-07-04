import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { TeamMember } from "@/types/index"
import { addUserToProject } from "@/api/TeamAPI"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"

type SearchResultProps = {
  user: TeamMember 
  reset: () => void
}

export default function SearchResult({user, reset}: SearchResultProps) {

  const params = useParams()
  const projectId = params.projectId!

  const queryClient = useQueryClient()

  const {mutate} = useMutation({
    mutationFn: addUserToProject,
    onError: (error) => {
      toast.error(error.message || 'User already exists in the project team')
    },
    onSuccess: (data) => {
      toast.success( data ||"User added to project successfully!!")
      reset() // Reset the form and search result
      queryClient.invalidateQueries({
        queryKey: ['projectTeam', projectId] // Invalidate the project team query to refresh the data
      })
    }
  })

  const handleAddUserToProject = () => {
    const data = {
      projectId,
      id: user._id
    }
    mutate(data)
  }

  return (

    <>
      <p className="mt-10 text-center font-bold">Result: </p>
      <div className="flex justify-between items-center">
        <p>{user.name}</p>
        <button 
          className="text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold cursor-pointer"
          onClick={handleAddUserToProject}
        >
          Add to Project
        </button>
      </div>
    </>

  )
}
