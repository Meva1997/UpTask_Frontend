import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import type { Project, ProjectFormData } from "@/types/index"
import ProjectForm from "./ProjectForm"
import { useMutation, useQueryClient } from "@tanstack/react-query" // Import useMutation from react-query to handle form submission
import { updateProject } from "@/api/ProjectAPI"
import { toast } from "react-toastify"

type EditProjectFormProps = {
  data: ProjectFormData
  projectId: Project['_id']
}

export default function EditProjectForm({data, projectId}: EditProjectFormProps) {

  const navigate = useNavigate(); 

  // Initialize the form with default values from the project data
  // This allows the form to be pre-populated with the existing project information
  // and enables the user to edit it.
  const { register, handleSubmit, formState: { errors } } = useForm({defaultValues: {
    projectName: data.projectName,
    clientName: data.clientName,
    description: data.description,
  } }); // Initialize form with default values

  const queryClient = useQueryClient(); // Get the query client to invalidate queries after mutation

  const {mutate} = useMutation({
    mutationFn: updateProject,
    onError: (error) => {
      toast.error('Error updating project: ' + error.message)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] }); // Invalidate the projects query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['editProject', projectId] }); // Invalidate the projects query to refresh the list
      toast.success(data);
      navigate('/'); // Redirect to the home page after successful update
    }
  })
  
  const handleForm = (formData: ProjectFormData) => {
    
    const data = {
      formData,
      projectId
    }

    mutate(data); // Call the mutation function to update the project and it only takes one parameter which is the data object containing formData and projectId
  }

  return (

    <>
      <div className='max-w-2xl mx-auto'>
        <h1 className="text-5xl font-black"> Edit Project </h1>
        <p className="my-5 text-2xl font-light text-gray-500">Fill in all fields to edit a project</p>
        <nav className="my-5">
          <Link to="/" className="px-10 py-3 text-xl font-bold text-white transition-all bg-purple-400 cursor-pointer hover:bg-purple-500" >
            Back to Projects
          </Link>
        </nav>

        <form action="" className='p-10 mt-10 bg-white rounded-lg shadow-lg' onSubmit={handleSubmit(handleForm)} noValidate>
          <ProjectForm 
            register={register} 
            errors={errors}
          />
          <input type="submit" value='Save Changes' className='w-full p-3 font-bold text-white uppercase transition-all cursor-pointer bg-fuchsia-600 hover:bg-fuchsia-700' />
        </form>
      </div>
    </>
  )
}
