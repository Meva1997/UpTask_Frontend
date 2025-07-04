import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTaskById, updateStatus } from '@/api/TaskAPI';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/utils';
import { statusTranslations } from '@/locales/es';
import type { TaskStatus } from '@/types/index';
import NotesPanel from '../notes/NotesPanel';


export default function TaskModalDetails() {

  const params = useParams(); // This will give you an object with the route parameters
  const projectId = params.projectId!; // Extract the projectId from the params
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get('viewTask')!;

  const show = taskId ? true : false;

  const {data } = useQuery({
    queryKey: ['task', taskId], // Unique key for the query
    queryFn: () => getTaskById({projectId, taskId}),
    enabled: !!taskId, // Only run the query if taskId is not null
    retry: false, // Disable automatic retries
  });

  const queryClient = useQueryClient();

  const {mutate, isPending, isError, error} = useMutation({
    mutationFn: updateStatus,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data || 'Task status updated successfully!');
      queryClient.invalidateQueries({queryKey: ['task', taskId]}); // Invalidate
      queryClient.invalidateQueries({queryKey: ['project', projectId]}); // Invalidate the project query to refresh the task list
      navigate(location.pathname, {replace: true}); // Close the modal after updating
    },
  });
  
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as TaskStatus;
    const data = {projectId, taskId, status};
    mutate(data);
  }

  if (isError) {
    toast.error(error?.message || 'Error fetching task', { toastId: 'error' });
    return (
      <div className="text-center text-red-500">
        <p>Error fetching task details.</p>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => navigate(`/projects/${projectId}`, { replace: true })}
        >
          Go Back
        </button> 
      </div>
    );
  }
  
  if(data) return (
    <>
      <Transition appear show={show} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, {replace: true})}>
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
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                          <p className='text-sm text-slate-400'>Added: {formatDate(data.createdAt)} </p>
                          <p className='text-sm text-slate-400'>Last Update: {formatDate(data.updatedAt)} </p>
                          <Dialog.Title
                              as="h3"
                              className="font-black text-4xl text-slate-600 my-5"
                          >{data.name}
                          </Dialog.Title>
                          <p className='text-lg text-slate-500 mb-2'>Description: {data.description}</p>
                            {data.completedBy.length ? (
                              <>
                              <p className='className="font-bold text-2xl text-slate-600 my-5"'>Previous updates:</p>
                              <ul className='list-inside list-decimal '>
                              {data.completedBy.map((activityLog) => (
                                <li key={activityLog._id}>
                                  <span className='font-bold text-fuchsia-600'>{statusTranslations[activityLog.status]}</span>{' '} by:{' '}
                                  {activityLog.user.name}
                                </li>
                              )
                              )}
                              </ul>
                              </>
                            ): null }

                          <div className='my-5 space-y-3'>
                              <label className='font-bold'>Current State: {data.status}</label>
                              <select className='w-full p-3 bg-white border border-gray-300' value={data.status} onChange={handleChange} disabled={isPending}>
                                {Object.entries(statusTranslations).map(([key, value]) => (
                                  <option key={key} value={key}>
                                    {value}
                                  </option>
                                ))}
                              </select>
                          </div>

                          <NotesPanel 
                            notes={data.notes}
                          />

                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
              </div>
          </Dialog>
      </Transition>
    </>
  )
}