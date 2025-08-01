import { Link, useLocation, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProjects } from "@/api/ProjectAPI"
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useAuth } from "@/hooks/useAuth"
import { isManager } from "@/utils/policies"
import DeleteProjectModal from "@/components/projects/DeleteProjectModal"


export default function DashboardView() {

  const location = useLocation() // Get the current location to handle query parameters
  const navigate = useNavigate() // Use navigate to redirect or change the URL

  const {data: user, isLoading: authLoading} = useAuth() // Custom hook to get authentication context, if needed
  
  const {data, isLoading} = useQuery({
    queryKey: ['projects'], // Unique key for the query
    queryFn: getProjects, // Function to fetch the data
  })

  if( isLoading && authLoading) {
    return <p className="text-center animate-bounce text-fuchsia-500 text-2xl">Loading...</p>
  }

  if(data && user)return (
    
    <>
      <h1 className="text-5xl font-black"> My Projects</h1>
      <p className="my-5 text-2xl font-light text-gray-500">Manage and Administer your Projects</p>
      <nav className="my-5">
        <Link to="/projects/create" className="px-10 py-3 text-xl font-bold text-white transition-all bg-purple-400 cursor-pointer hover:bg-purple-500" >
          New Project
        </Link>
      </nav>

      {data.length ? (
        <ul role="list" className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg">
        {data.map((project) => (
          <li key={project._id} className="flex justify-between gap-x-6 px-5 py-10">
              <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                    <div className="mb-2">
                      {isManager(project.manager, user._id) ? (
                        <p className="font-bold text-xs uppercase bg-indigo-50 text-indigo-500 border-2 border-indigo-500 rounded-lg inline-block py-1 px-5">
                          Manager
                        </p>
                      ) : (
                        <p className="font-bold text-xs uppercase bg-green-50 text-green-500 border-2 border-green-500 rounded-lg inline-block py-1 px-5">Collaborator</p>
                      )}
                    </div>
                      <Link to={`/projects/${project._id}`}
                          className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold"
                      >{project.projectName}</Link>
                      <p className="text-sm text-gray-400">
                          Cliente: {project.clientName}
                      </p>
                      <p className="text-sm text-gray-400">
                          {project.description}
                      </p>
                  </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-6">
                <Menu as="div" className="relative flex-none">
                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                        <span className="sr-only">opciones</span>
                        <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                    </Menu.Button>
                    <Transition as={Fragment} enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95">
                        <Menu.Items
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                        >
                          <Menu.Item>
                            <Link
                              to={`/projects/${project._id}`}
                              className="block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer"
                            >
                              See Project
                            </Link>
                          </Menu.Item>

                          {isManager(project.manager, user._id) && (
                            <>
                              <Menu.Item>
                                <Link to={`/projects/${project._id}/edit`}
                                  className='block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer'
                                >
                                  Edit Project
                                </Link>
                              </Menu.Item>
                              <Menu.Item>
                                <button 
                                  type='button' 
                                  className='block px-3 py-1 text-sm leading-6 text-red-500 cursor-pointer'
                                  onClick={() => navigate(location.pathname + `?deleteProject=${project._id}`)}
                                >
                                  Delete Project
                                </button>
                              </Menu.Item>
                            </>
                          )}
                        </Menu.Items>
                    </Transition>
                  </Menu>
              </div>
          </li>
        ))}
        </ul>

      ) : (
        <p className="text-center py-20">There are no projects yet... Click here to {' '}
          <Link to="/projects/create" className="text-fuchsia-500 font-bold animate-pulse">Create Project</Link>
        </p>
      )}


      <DeleteProjectModal />
    </>
  )

}