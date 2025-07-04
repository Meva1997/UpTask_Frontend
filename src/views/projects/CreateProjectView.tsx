import { Link, useNavigate } from 'react-router-dom';
import {useForm} from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import {  toast } from 'react-toastify';
import ProjectForm from '@/components/projects/ProjectForm';
import type { ProjectFormData } from '@/types/index';
import {createProject} from '@/api/ProjectAPI';

export default function CreateProjectView() {

  const navigate = useNavigate(); // Hook to navigate programmatically after project creation
  const initialValues : ProjectFormData  = {
    projectName: '',
    clientName: '',
    description: ''
  }
  const { register, handleSubmit, reset, formState: { errors } } = useForm({defaultValues: initialValues }); // Initialize form with default values

  //react-query mutation to handle project creation
  const {mutate} = useMutation({
    mutationFn: createProject, // Function to call when the form is submitted no need to pass the project ID as it is created
    onSuccess: (data) => {
      toast.success(data); // Show success message
      reset(); // Reset the form after successful submission
      navigate('/'); // Navigate back to the projects list
    },
    onError: (error) => {
      toast.error(error.message || 'An error occurred while creating the project'); // Show error message
    }
  })

  const handleForm = (formData : ProjectFormData) => mutate(formData); // Call the mutation function with form data

  return (

    <>
      <div className='max-w-2xl mx-auto'>
        <h1 className="text-5xl font-black"> Create Project </h1>
        <p className="my-5 text-2xl font-light text-gray-500">Fill in all fields to create a project</p>
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
          <input type="submit" value='Create Project' className='w-full p-3 font-bold text-white uppercase transition-all cursor-pointer bg-fuchsia-600 hover:bg-fuchsia-700' />
        </form>
      </div>
    </>
  )
}
