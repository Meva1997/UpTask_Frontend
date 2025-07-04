import api from "@/lib/axios";
import { isAxiosError } from "axios";
import type { Note, NoteFormData, Project, Task } from "../types";

type NoteAPIType = {
  formData: NoteFormData
  projectId: Project['_id']
  taskId: Task['_id']
  noteId: Note['_id']
}

export async function createNote({formData, projectId, taskId}: Pick<NoteAPIType, 'projectId' | 'taskId' | 'formData'>) {

  try {
    const url = `/projects/${projectId}/tasks/${taskId}/notes`; // Construct the URL for creating a note
    const {data} = await api.post<string>(url, formData); // Send a POST request to create a note
    return data; // Return the response data
  } catch (error) {
    if(isAxiosError(error) && error.response){
      throw new Error(error.response.data.error);
    }
  }
}

export async function deleteNote({projectId, taskId, noteId}: Pick<NoteAPIType, 'projectId' | 'taskId' | 'noteId'> ) {
  try {
    const url = `/projects/${projectId}/tasks/${taskId}/notes/${noteId}`; // Construct the URL for deleting a note
    const {data} = await api.delete<string>(url); // Send a DELETE request to delete a note
    return data; // Return the response data
  } catch (error) {
    if(isAxiosError(error) && error.response){
      throw new Error(error.response.data.error);
    }
  }
}