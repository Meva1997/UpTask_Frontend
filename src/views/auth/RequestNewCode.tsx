import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import type { RequestConfirmationCodeForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { requestConfirmationCode } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function RegisterView() {
    const initialValues: RequestConfirmationCodeForm = {
        email: ''
    }

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const {mutate} = useMutation({
      mutationFn: requestConfirmationCode,
      onError: (error) => {
        toast.error(error.message); // Show error message if the mutation fails
      }, 
      onSuccess: (data) => {
        toast.success(data); // Show success message if the mutation succeeds
        reset(); // Reset the form after successful submission
      }
    })

    const handleRequestCode = (formData: RequestConfirmationCodeForm) => mutate(formData);

  return (
    <>
        <h1 className="text-5xl font-black text-white">Request Confirmation Code</h1>
        <p className="text-2xl font-light text-white mt-5">
            Type your e-mail to send a {''}
            <span className=" text-fuchsia-500 font-bold"> new code </span>
        </p>

        <form
            onSubmit={handleSubmit(handleRequestCode)}
            className="space-y-8 p-10 rounded-lg bg-white mt-10"
            noValidate
        >
          <div className="flex flex-col gap-5">
              <label
                  className="font-normal text-2xl"
                  htmlFor="email"
              >E-mail</label>
              <input
                  id="email"
                  type="email"
                  placeholder="Email de Registro"
                  className="w-full p-3 rounded-lg border-gray-300 border"
                  {...register("email", {
                      required: "E-mail is required",
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
              value='Send Code'
              className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer"
          />
        </form>

        <nav className="mt-10 flex flex-col space-y-4">
            <Link
                to='/auth/login'
                className="text-center text-gray-300 font-normal"
            >
                Already have an account? Log In
            </Link>
            <Link
                to='/auth/forgot-password'
                className="text-center text-gray-300 font-normal"
            >
                I forgot my password. Create a new one
            </Link>
        </nav>
    </>
  )
}