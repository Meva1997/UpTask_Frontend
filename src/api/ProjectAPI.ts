import api from '@/lib/axios';
import {dashboardProjectSchema, editProjectSchema, projectSchema, type Project, type ProjectFormData} from '@/types/index';
import { isAxiosError } from 'axios';

export async function createProject(formData: ProjectFormData) {
  
  try {
    const {data} = await api.post('/projects', formData); 
    return data; // Return the created project data
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      // Handle Axios error
      throw new Error(error.response.data.error);
    }
  }
}

export async function getProjects() {

  try {
    const {data} = await api('/projects')
    const response = dashboardProjectSchema.safeParse(data); // Validate the response data against the schema
    if(response.success) {
      return response.data; // Return the validated data
    }
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      // Handle Axios error
      throw new Error(error.response.data.error);
    }
  }
}

export async function getProjectById(id: Project['_id']) {

  try {
    const {data} = await api(`/projects/${id}`);
    const response = editProjectSchema.safeParse(data); // Validate the response data against the schema
    if(response.success) {
      return response.data; // Return the validated project data
    }
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      // Handle Axios error
      throw new Error(error.response.data.error);
    }
  }
}

export async function getFullProject(id: Project['_id']) {

  try {
    const {data} = await api(`/projects/${id}`)
    const response = projectSchema.safeParse(data); // Validate the response data against the schema
    if(response.success) {
      return response.data; // Return the validated project data
    }
    
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      console.error("Error fetching project:", error.response.data.error);
      console.error("Error details:", error.response.data);
      // Handle Axios error
      throw new Error(error.response.data.error);
    }
  }
}

type ProjectAPIType = {
  formData: ProjectFormData;
  projectId: Project['_id'];
}

export async function updateProject({formData, projectId}: ProjectAPIType ){
  try {
    const {data} = await api.put<string>(`/projects/${projectId}`, formData); //for updating a project, pass the project ID in the URL and the form data in the request body
    return data; // Return the updated project data
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      // Handle Axios error
      throw new Error(error.response.data.error);
    }
  }
}

export async function deleteProject(id: Project['_id']) {

  try {
    const {data} = await api.delete<string>(`/projects/${id}`); // Delete the project by ID
    return data; // Return the response data
  } catch (error) {
    if(isAxiosError(error) && error.response) {
      // Handle Axios error
      throw new Error(error.response.data.error);
    }
  }
}