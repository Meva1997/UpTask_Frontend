import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { UserRegistrationForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { createAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function RegisterView() {
  
  const initialValues: UserRegistrationForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  }

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

  const navigate = useNavigate(); // Use navigate to redirect after successful registration

  const {mutate} = useMutation({
    mutationFn: createAccount,
    onError: (error) =>{
      toast.error(error.message)
    }, 
    onSuccess: (data) => {
      toast.success(data); // Show success message
      reset(); // Reset the form after successful registration
      navigate('/auth/confirm-account'); // Redirect to the confirmation page

    }
  })

  const password = watch('password'); // Watch the password field to validate confirmation this comes from react-hook-form

  const handleRegister = (formData: UserRegistrationForm) => mutate(formData); // Call the mutation to create an account

  return (
    <>
      <h1 className="text-5xl font-black text-white">Create Account</h1>
      <p className="text-2xl font-light text-white mt-5">
        Complete the form to {''}
        <span className=" text-fuchsia-500 font-bold">Create Account</span>
      </p>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="space-y-8 p-10  bg-white mt-10"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
            htmlFor="email"
          >Email</label>
          <input
            id="email"
            type="email"
            placeholder="Registration Email"
            className="w-full p-3  border-gray-300 border"
            {...register("email", {
              required: "The E-mail is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail is not valid",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
          >Name</label>
          <input
            type="name"
            placeholder="Registration Name"
            className="w-full p-3  border-gray-300 border"
            {...register("name", {
              required: "The Name is required",
            })}
          />
          {errors.name && (
            <ErrorMessage>{errors.name.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
          >Password</label>

          <input
            type="password"
            placeholder="Registration Password"
            className="w-full p-3  border-gray-300 border"
            {...register("password", {
              required: "The Password is required",
              minLength: {
                value: 8,
                message: 'The Password must be at least 8 characters long',
              }
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
          >Confirm Password</label>

          <input
            id="password_confirmation"
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3  border-gray-300 border"
            {...register("password_confirmation", {
              required: "The Password Confirmation is required",
              validate: value => value === password || 'The Passwords do not match',
            })}
          />

          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value='Register'
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link to={'/auth/login'} className="text-center text-gray-300 font-normal  hover:text-fuchsia-500 transition-colors">Already have an account? Log in</Link>
        <Link to={'/auth/forgot-password'} className="text-center text-gray-300 font-normal  hover:text-fuchsia-500 transition-colors">Forgot Password? Generate a new one</Link>
      </nav>
    </>
  )
}