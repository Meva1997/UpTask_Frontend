import type { NoteFormData } from '@/types/index';
import {useForm} from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ErrorMessage from '../ErrorMessage';
import { createNote } from '@/api/NoteAPI';
import { toast } from 'react-toastify';
import { useLocation, useParams } from 'react-router-dom';

export default function AddNoteForm() {

  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const projectId = params.projectId!;
  const taskId = queryParams.get('viewTask')!; // Extract the taskId from the query parameters
  const initialValues : NoteFormData = {
    content: ''
  }

  const {register, handleSubmit, reset, formState: {errors}} = useForm({
    defaultValues: initialValues
  });

  const queryClient = useQueryClient();
  const {mutate} = useMutation({
    mutationFn: createNote,
    onError: (error) => {
      toast.error(error.message || 'Error creating note !!')
    }, 
    onSuccess: (data) => {
      toast.success(data || 'Note created successfully !!')
      queryClient.invalidateQueries({queryKey: ['task', taskId]}); // Invalidate the task query to refresh the notes
      reset(); // Reset the form after successful submission
    }
  })

  const handleAddNote = (formData: NoteFormData) => {
     const data = {
      formData,
      projectId,
      taskId
    };
    mutate(data);
  };

  return (

    <form onSubmit={handleSubmit(handleAddNote)} className="space-y-3" noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="content" className="font-bold">Create Note</label>
        <input type="text" id="content" placeholder="Note Content" className="w-full p-3 border border-gray-300" {...register('content', {
          required: 'A note is required',
        })}/>
        {errors.content && (
          <ErrorMessage>{errors.content.message}</ErrorMessage>
        )}
      </div>
      <input type="submit" value="Create Note" className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 text-white font-black cursor-pointer"/>
    </form>
  )
}
