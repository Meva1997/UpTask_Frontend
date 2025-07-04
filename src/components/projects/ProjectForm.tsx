import type { FieldErrors, UseFormRegister } from "react-hook-form"
import ErrorMessage from "../ErrorMessage"
import type { ProjectFormData } from "@/types/index"

type ProjectFormProps= {
  register: UseFormRegister<ProjectFormData>
  errors: FieldErrors<ProjectFormData>
  
}

export default function ProjectForm({register, errors} : ProjectFormProps) {
  return (
      <>
          <div className="mb-5 space-y-3">
              <label htmlFor="projectName" className="text-sm font-bold uppercase">
                  Project Name
              </label>
              <input
                  id="projectName"
                  className="w-full p-3 border border-gray-200"
                  type="text"
                  placeholder="Project Name"
                  {...register("projectName", {
                      required: "The Project Name is required",
                  })}
              />

              {errors.projectName && (
                  <ErrorMessage>{errors.projectName.message}</ErrorMessage>
              )}
          </div>

          <div className="mb-5 space-y-3">
              <label htmlFor="clientName" className="text-sm font-bold uppercase">
                  Client Name
              </label>
              <input
                  id="clientName"
                  className="w-full p-3 border border-gray-200"
                  type="text"
                  placeholder="Client Name"
                  {...register("clientName", {
                      required: "The Client Name is required",
                  })}
              />

              {errors.clientName && (
                  <ErrorMessage>{errors.clientName.message}</ErrorMessage>
              )}
          </div>

          <div className="mb-5 space-y-3">
              <label htmlFor="description" className="text-sm font-bold uppercase">
                  Description
              </label>
              <textarea
                  id="description"
                  className="w-full p-3 border border-gray-200"
                  placeholder="Project Description"
                  {...register("description", {
                      required: "The Project Description is required",
                  })}
              />

              {errors.description && (
                  <ErrorMessage>{errors.description.message}</ErrorMessage>
              )}
          </div>
      </>
  )
}