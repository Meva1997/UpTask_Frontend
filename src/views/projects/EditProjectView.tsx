import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/api/ProjectAPI";
import EditProjectForm from "@/components/projects/EditProjectForm";

export default function EditProjectView() {

  const params = useParams(); // This will give you an object with the route parameters
  // For example, if the URL is /projects/123/edit, params will be { projectId: "123" }

  const projectId = params.projectId!; // Extract the projectId from the params

  const {data, isLoading, isError } = useQuery({
    queryKey: ['editProject', projectId], // Unique key for the query
    queryFn: () => getProjectById(projectId), // Function to fetch the project by ID and if a function has a parameter use a callback function
  })

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <Navigate to="/404" />
  if(data) return <EditProjectForm data={data} projectId={projectId} />

  
}
