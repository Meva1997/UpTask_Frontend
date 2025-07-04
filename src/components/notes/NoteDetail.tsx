import { deleteNote } from "@/api/NoteAPI"
import { useAuth } from "@/hooks/useAuth"
import type { Note } from "@/types/index"
import { formatDate } from "@/utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type NoteDetailProps = {
  note: Note
}

export default function NoteDetail({note}: NoteDetailProps) {

  const {data, isLoading} = useAuth()
  const canDelete = useMemo(() => data?._id === note.createdBy._id , [data, note.createdBy._id])
  const params = useParams()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const projectId = params.projectId! // Extract the projectId from the params
  const taskId = queryParams.get('viewTask')! // Extract the taskId from the query parameters

  const queryClient = useQueryClient()

  const {mutate} = useMutation({
    mutationFn: deleteNote, 
    onError: (error) => {
      toast.error(error.message || 'Error deleting note !!')
    }, 
    onSuccess: (data) => {
      toast.success(data || 'Note deleted successfully !!')
      queryClient.invalidateQueries({queryKey: ['task', taskId]}) // Invalidate the task query to refresh the notes
    }
  })

  if(isLoading) return <p>Loading...</p>

  return (

    <div className="p-3 flex justify-between items-center">
      <div>
        <p>
          {note.content} by: <span className="font-bold">{note.createdBy.name}</span>
        </p>
        <p className="text-xs text-slate-500">
          {formatDate(note.createdAt)}
        </p>
      </div>
      {canDelete && (
        <button
          type="button"
          className="bg-red-600 hover:bg-red-800 text-white p-2 text-xs font-bold cursor-pointer transition-colors"
          onClick={() => mutate({projectId, taskId, noteId: note._id})}
        >
          Delete
        </button>
      )}
    </div>

  )
}
