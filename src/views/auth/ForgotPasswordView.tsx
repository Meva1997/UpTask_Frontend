import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import  type { ForgotPasswordForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function ForgotPasswordView() {
  const initialValues: ForgotPasswordForm = {
    email: ''
  }
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

  const navigate = useNavigate();

  const {mutate} = useMutation({
    mutationFn: forgotPassword,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset(); // Reset the form after successful password reset request
      navigate('/auth/new-password')
    }
  });
  
  const handleForgotPassword = (formData: ForgotPasswordForm) => mutate(formData);


  return (
    <>
      <h1 className="text-5xl font-black text-white">Reset Password</h1>
        <p className="text-2xl font-light text-white mt-5">
          Complete the form to {''}
          <span className=" text-fuchsia-500 font-bold">Reset Password</span>
        </p>

      <form
        onSubmit={handleSubmit(handleForgotPassword)}
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
            placeholder="Enter your email"
            className="w-full p-3  border-gray-300 border"
            {...register("email", {
              required: "The email is required",
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

        <input
          type="submit"
          value='Send Reset Link'
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to='/auth/login'
          className="text-center text-gray-300 font-normal hover:text-fuchsia-500 transition-colors"
        >
          Already have an account? Log in
        </Link>

        <Link
          to='/auth/register'
          className="text-center text-gray-300 font-normal hover:text-fuchsia-500 transition-colors"
        >
          Don't have an account? Register
        </Link>
      </nav>
    </>
  )
}