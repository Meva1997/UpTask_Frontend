import { Fragment } from "react/jsx-runtime";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { getProjectTeam, removeUserFromProject } from "@/api/TeamAPI";
import AddMemberModal from "@/components/team/AddMemberModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link, useParams, Navigate } from "react-router-dom"
import { toast } from "react-toastify";

export default function ProjectTeamView() {

  const navigate = useNavigate(); // Hook to programmatically navigate
  const params = useParams(); // This will give you an object with the route parameters
  const projectId = params.projectId!; // Extract the projectId from the params

  const { data, isLoading, isError } = useQuery({
    queryKey: ['projectTeam', projectId],
    queryFn: () => getProjectTeam(projectId),
    retry: false,
  });

  const queryClient = useQueryClient();

  const {mutate} = useMutation({
    mutationFn: removeUserFromProject,
    onError: (error) => {
      toast.error(error.message || 'Error removing user from project team!!');
    }, 
    onSuccess: (data) => {
      toast.success(data || "User removed from project team successfully!!");
      queryClient.invalidateQueries({
        queryKey: ['projectTeam', projectId] // Invalidate the project team query to refresh the data
      });
    }
  })

  if(isLoading) return <p className="text-center text-2xl font-bold animate-pulse text-fuchsia-500">Loading...</p>
  if(isError) return <Navigate to="/404" />

  if(data) return (

    <>
      <h1 className="text-5xl font-black">Manage Team</h1>
      <p className="mt-5 text-2xl font-light text-gray-500 ">Manage your work team for this project</p>

      <nav className="flex gap-3 my-5">
        <button type="button" className="px-10 py-3 text-xl font-bold text-white transition-all bg-purple-400 cursor-pointer hover:bg-purple-500"
          onClick={() => navigate(location.pathname + '?addMember=true')}
        >Add a member</button>

        <Link to={`/projects/${projectId}`} className="px-10 py-3 text-xl font-bold text-white transition-all bg-fuchsia-600 cursor-pointer hover:bg-fuchsia-700">
          Back to Project
        </Link>
      </nav>

      <h2 className="text-5xl font-black my-10">Current Members</h2>
        {data.length ? (
          <ul role="list" className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg">
            {data?.map((member) => (
              <li key={member._id} className="flex justify-between gap-x-6 px-5 py-10">
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                      <p className="text-2xl font-black text-gray-600">
                          {member.name}
                      </p>
                      <p className="text-sm text-gray-400">
                          {member.email}
                      </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-6">
                  <Menu as="div" className="relative flex-none">
                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                        <span className="sr-only">opciones</span>
                        <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                          <Menu.Item>
                              <button
                                  type='button'
                                  className='block px-3 py-1 text-sm leading-6 text-red-500'
                                  onClick={() => mutate({projectId, userId: member._id})}
                              >
                                  Delete member from project
                              </button>
                          </Menu.Item>
                        </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
            <p className='text-center py-20'>No members found on this team</p>
        )}

      <AddMemberModal />
    </>

  )
}
