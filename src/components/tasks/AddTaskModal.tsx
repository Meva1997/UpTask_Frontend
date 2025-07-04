import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {useForm} from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import TaskForm from './TaskForm';
import type { TaskFormData } from '@/types/index';
import { createTask } from '@/api/TaskAPI';
import { toast } from 'react-toastify';

export default function AddTaskModal() {

  // Use useLocation to access the current URL and its query parameters
  // This allows us to determine if the modal should be shown based on the presence of a query parameter
  // For example, if the URL is /projects/123?newTask=true
  // we can check for the 'newTask' query parameter to decide whether to show the modal or not
  // This is useful for conditionally rendering the modal based on user actions,
  // such as clicking a button to add a new task, which updates the URL with the query parameter.
  const navigate = useNavigate(); // Hook to programmatically navigate, allowing us to change the URL or redirect the user
  const location = useLocation(); // Hook to access the current location object, which contains the URL and query parameters
  const queryParams = new URLSearchParams(location.search); // Extract query parameters from the current URL
  const modalTask = queryParams.get('newTask'); // Get the value of the 'newTask' query parameter, which indicates whether to show the modal or not
  const show = modalTask ? true : false;

  //Obtain projectId from the URL
  const params = useParams()
  const projectId = params.projectId!; // Extract the projectId from the URL parameters, which is used to associate the new task with a specific project
  

  const initialValues: TaskFormData = {
    name: '',
    description: ''
  }

  const {register, handleSubmit, reset, formState: {errors}} = useForm({defaultValues: initialValues}); // Initialize the form with default values using react-hook-form

  const queryClient = useQueryClient(); // Create a query client to manage the cache and invalidate queries after creating a new task

  const {mutate} = useMutation({
    mutationFn: createTask, // Function to create a new task, defined in the TaskAPI module
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['project', projectId]}); // Invalidate the tasks query for the current project to refresh the task list after creating a new task
      toast.success(data)
      reset(); // Reset the form fields to their initial values after successfully creating a task
      navigate(location.pathname, { replace: true }); // Navigate back to the current path without the query parameter after successfully creating a task
    }
  })

  const handleCreateTask = (formData: TaskFormData) => {
    const data = {
      formData,
      projectId
    }
    mutate(data); // Call the mutation function to create a new task with the provided form data and projectId
  }

  return (
    <>
      <Transition appear show={show} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true })}> {/* // Close the modal when the user clicks outside of it or presses the escape key */}
              <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
              >
              <div className="fixed inset-0 bg-black/60" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex items-center justify-center min-h-full p-4 text-center">
                      <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                      >
                        <Dialog.Panel className="w-full max-w-4xl p-16 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <Dialog.Title
                                as="h3"
                                className="my-5 text-4xl font-black"
                            >
                                New Task
                            </Dialog.Title>

                            <p className="text-xl font-bold">Complete the form and create {''}
                                <span className="text-fuchsia-600">a task</span>
                            </p>
                           

                            <form className='mt-10 space-y-3' noValidate onSubmit={handleSubmit(handleCreateTask)}>
                              <TaskForm 
                                register={register}
                                errors={errors}
                              />
                            <input type="submit" value='Save Task' className='w-full p-3 font-bold text-white uppercase transition-all cursor-pointer bg-fuchsia-600 hover:bg-fuchsia-700' />
                            </form>

                        </Dialog.Panel>
                      </Transition.Child>
                  </div>
              </div>
          </Dialog>
      </Transition>
    </>
  )
}