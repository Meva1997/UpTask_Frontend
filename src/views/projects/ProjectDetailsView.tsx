import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFullProject } from "@/api/ProjectAPI";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskList from "@/components/tasks/TaskList";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policies";
import { useMemo } from "react";

export default function ProjectDetailsView() {


  const {data: user, isLoading: authLoading} = useAuth(); // Custom hook to get authentication context, if needed
  const navigate = useNavigate(); // Hook to programmatically navigate

  const params = useParams(); // This will give you an object with the route parameters
  // For example, if the URL is /projects/123/edit, params will be { projectId: "123" }

  const projectId = params.projectId!; // Extract the projectId from the params

  const {data, isLoading, isError } = useQuery({
    queryKey: ['project', projectId], // Unique key for the query
    queryFn: () => getFullProject(projectId), // Function to fetch the project by ID and if a function has a parameter use a callback function
    retry:false
  })

  const canEdit = useMemo(() => data?.manager === user?._id ,[data, user])

  if (isLoading && authLoading) return <div>Loading...</div>;
  if (isError) return <Navigate to="/404" />


  if(data && user) return (
    
    <>
      <h1 className="text-5xl font-black">{data.projectName}</h1>
      <p className="mt-5 text-2xl font-light text-gray-500 ">{data.description}</p>

      {isManager(data.manager, user._id) && (
        <nav className="flex gap-3 my-5">
          <button type="button" className="px-10 py-3 text-xl font-bold text-white transition-all bg-purple-400 cursor-pointer hover:bg-purple-500"
            onClick={() => navigate(location.pathname + '?newTask=true')}
          >Add a Task</button>

          <Link to={'team'} className="px-10 py-3 text-xl font-bold text-white transition-all bg-fuchsia-600 cursor-pointer hover:bg-fuchsia-700">
            Team Members 
          </Link>
        </nav>
      )}

      <TaskList 
        tasks={data.tasks}
        canEdit={canEdit}
      />

      <AddTaskModal />
      <EditTaskData />
      <TaskModalDetails />
    </>
  )

  
}
