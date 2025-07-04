import { Navigate, useLocation, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "@/api/TaskAPI";
import EditTaskModal from "./EditTaskModal";

export default function EditTaskData() {

  const params = useParams(); // This will give you an object with the route parameters
  const projectId = params.projectId!; // Extract the projectId from the params

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get('editTask')!;

  const {data, isError} = useQuery({
    queryKey: ['task', taskId], 
    queryFn: () => getTaskById({projectId, taskId}),
    enabled: !!taskId, // Only run the query if taskId is not null this converts the string to a boolean
  })

  if(data){
    return <EditTaskModal data={data} taskId={taskId} />;
  }

  if(isError){
    console.error("Task not found or an error occurred while fetching the task data.");
    return <Navigate to="/404" />;
  }
}