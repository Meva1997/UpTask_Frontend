import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { taskSchema, type Project, type Task, type TaskFormData } from "../types";


type TaskAPI = {
  formData: TaskFormData;
  projectId: Project["_id"];
  taskId: Task["_id"];
  status: Task["status"];
}

export async function createTask({formData, projectId}: Pick<TaskAPI, 'formData' | 'projectId'>) {

  try {
    const url = `/projects/${projectId}/tasks`;
    const {data} = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if(isAxiosError(error) && error.response){
      throw new Error(error.response.data.error)
    }
  }
}

export async function getTaskById( {projectId, taskId }:  Pick<TaskAPI, 'projectId' | 'taskId'>) {
  try {
    const url = `/projects/${projectId}/tasks/${taskId}`;
    const { data } = await api.get(url);
    const response = taskSchema.safeParse(data);
    
    if (response.success) {
      return response.data;
    } else {
      console.error("Validation failed for task data:", response.error);
      throw new Error("Invalid task data");
    }

  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw new Error("Error fetching task");
  }

}

export async function updateTask({projectId, taskId, formData}: Pick<TaskAPI, 'projectId' | 'taskId' | 'formData'>) {

  try {
    const url = `/projects/${projectId}/tasks/${taskId}`;
    const {data} = await api.put<string>(url, formData);
    return data;
  } catch (error) {
    if(isAxiosError(error) && error.response){
      throw new Error(error.response.data.error)
    }
  }
}

export async function deleteTask({projectId, taskId}: Pick<TaskAPI, 'projectId' | 'taskId'>) {

  try {
    const url = `/projects/${projectId}/tasks/${taskId}`;
    const {data} = await api.delete<string>(url);
    return data;
  } catch (error) {
    if(isAxiosError(error) && error.response){
      throw new Error(error.response.data.error)
    }
  }
}

export async function updateStatus({projectId, taskId, status}: Pick<TaskAPI, 'projectId' | 'taskId' | 'status'>) {
  try {
    const url = `/projects/${projectId}/tasks/${taskId}/status`;
    const {data} = await api.post<string>(url, {status});
    return data;
  } catch (error) {
    if(isAxiosError(error) && error.response){
      throw new Error(error.response.data.error)
    }
  }
}