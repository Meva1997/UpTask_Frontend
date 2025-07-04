import {z} from "zod";

//auth users

export const authSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  current_password: z.string(),
  password: z.string(),
  password_confirmation: z.string(),
  token: z.string()
})

export type Auth = z.infer<typeof authSchema>; // TypeScript type based on the Zod schema
export type UserLoginForm = Pick<Auth, 'email' | 'password'>; // TypeScript type for user login form data
export type UserRegistrationForm = Pick<Auth, 'name' | 'email' | 'password' | 'password_confirmation'>; // TypeScript type for user registration form data
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>; // TypeScript type for request confirmation code form data
export type ForgotPasswordForm = Pick<Auth, 'email'>; // TypeScript type for forgot password form data
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>; // TypeScript type for new password form data
export type UpdateCurrentuserPasswordForm = Pick<Auth, 'current_password' | 'password' | 'password_confirmation'>; // TypeScript type for update current user password form data
export type ConfirmToken = Pick<Auth, 'token'>; // TypeScript type for confirm token
export type checkPasswordForm = Pick<Auth, 'password'>; // TypeScript type for check password form data

//users
export const userSchema = authSchema.pick({
  name: true,
  email: true
}).extend({
  _id: z.string()
})

export type User = z.infer<typeof userSchema>; // TypeScript type based on the Zod schema
export type UserProfileForm = Pick<User, 'name' | 'email'>; // TypeScript type for user profile form data

//! Notes
export const noteSchema = z.object({
  _id: z.string(),
  content: z.string(),
  createdBy: userSchema, 
  task: z.string(), // Reference to the task ID
  createdAt: z.string()
})

export type Note = z.infer<typeof noteSchema>; // TypeScript type based on the Zod schema
export type NoteFormData = Pick<Note, 'content'>; // TypeScript type for

//tasks 
export const taskStatusSchema = z.enum(['pending', 'onHold', 'inProgress', 'underReview', 'completed']);
export type TaskStatus = z.infer<typeof taskStatusSchema>; // TypeScript type based on the Zod schema

export const taskSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  project: z.string(),
  status: taskStatusSchema,
  completedBy: z.array(z.object({
    _id: z.string(),
    user: userSchema,
    status: taskStatusSchema
  })),
  notes: z.array(noteSchema.extend({
    createdBy: userSchema
  })),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const taskProjectSchema = taskSchema.pick({
  _id: true,
  name: true,
  description: true,
  status: true
})

export type Task = z.infer<typeof taskSchema>; // TypeScript type based on the Zod schema
export type TaskFormData = Pick<Task, 'name' | 'description' >; 
export type TaskProject = z.infer<typeof taskProjectSchema>; // TypeScript type based on the Zod schema

//! Projects
export const projectSchema = z.object({
  _id: z.string(), 
  projectName: z.string(),
  clientName: z.string(),
  description: z.string(),
  manager: z.string(userSchema.pick({_id: true })), // Reference to the user who manages the project
  tasks: z.array(taskProjectSchema),
  team: z.array(z.string(userSchema.pick({_id: true})))

})

export const dashboardProjectSchema = z.array(
  projectSchema.pick({
    _id: true,
    projectName: true,
    clientName: true,
    description: true,
    manager: true
  })
)

export const editProjectSchema = projectSchema.pick({
  projectName: true,
  clientName: true,
  description: true
})

export type Project = z.infer<typeof projectSchema>; // TypeScript type based on the Zod schema
export type ProjectFormData = Pick<Project, 'projectName' | 'clientName' | 'description'>;

//! Team
export const teamMemberSchema = userSchema.pick({
  name: true,
  email: true,
  _id: true
})

export const teamMembersSchema = z.array(teamMemberSchema);
export type TeamMember = z.infer<typeof teamMemberSchema>; // TypeScript type based on the Zod schema
export type TeamMemberForm = Pick<TeamMember, 'email'>; // TypeScript type for team member form data