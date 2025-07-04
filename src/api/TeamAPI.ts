import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { teamMembersSchema, type Project, type TeamMember, type TeamMemberForm } from "@/types/index";

export async function findUserByEmail({projectId, formData} : {projectId: Project["_id"], formData: TeamMemberForm}) {

  try {
    const url = `/projects/${projectId}/team/find`;
    const { data } = await api.post(url, formData);
    return data; // Assuming the API returns the user data
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function addUserToProject({projectId, id} : {projectId: Project["_id"], id: TeamMember["_id"]}) {

  try {
    const url = `/projects/${projectId}/team`;
    const { data } = await api.post<string>(url, { id });
    return data; // Assuming the API returns the updated project data
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    
  }
}

export async function removeUserFromProject({projectId, userId} : {projectId: Project["_id"], userId: TeamMember["_id"]}) {

  try {
    const url = `/projects/${projectId}/team/${userId}`;
    const { data } = await api.delete<string>(url);
    return data; // Assuming the API returns a success message or updated project data
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    
  }
}

export async function getProjectTeam(projectId: Project["_id"]) {

  try {
    const url = `/projects/${projectId}/team`;
    const { data } = await api.get(url);
    const response = teamMembersSchema.safeParse(data);

    if (response.success) {
      return response.data; // Return the parsed team members
    } else {
      console.error("Validation failed for team members:", response.error);
      throw new Error("Invalid team member data format");
    }
    
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    
  }
}

