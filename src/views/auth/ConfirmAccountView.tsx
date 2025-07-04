import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {PinInput, PinInputField} from "@chakra-ui/pin-input";
import { useMutation } from "@tanstack/react-query";
import type { ConfirmToken } from "@/types/index";
import { confirmAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function ConfirmAccountView() {

  const [token, setToken] = useState<ConfirmToken['token']>(''); // State to hold the token if needed

  const navigate = useNavigate(); // Use navigate to redirect after successful confirmation

  const {mutate} = useMutation({
    mutationFn: confirmAccount,
    onError: (error) => {
      toast.error(error.message); // Show error message if the mutation fails
    }, 
    onSuccess: (data) => {
      toast.success(data); // Show success message if the mutation succeeds
      navigate('/auth/login'); // Redirect to the login page after successful confirmation
    }
  })

  const handleChange = (token: ConfirmToken['token']) => {
    setToken(token); // Update the token state when the input changes
  }

  const handleComplete = (token: ConfirmToken['token']) => mutate({ token }); // Call the mutation to confirm the account with the token and its an object with the token property

  return (
    <>
      <h1 className="text-5xl font-black text-white">Confirm Account</h1>
      <p className="text-2xl font-light text-white mt-5">
        Insert the code you recieved {''}
        <span className=" text-fuchsia-500 font-bold"> by e-mail</span>
      </p>
      <form
        className="space-y-8 p-10 bg-white mt-10"
      >
        <label
          className="font-normal text-2xl text-center block"
        >6 Digit Code</label>
        <div className="flex justify-center gap-5">
          <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
          </PinInput>
        </div>

      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to='/auth/request-code'
          className="text-center text-gray-300 font-normal hover:text-fuchsia-500 transition-colors"
        >
          Request a new code
        </Link>
      </nav>

    </>
  )
}