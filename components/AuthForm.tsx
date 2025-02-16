"use client"

import React from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from 'next/link'
import { createAccount } from '@/lib/actions/user.actions'

const formSchema = z.object({
  fullName: z.string().min(2).max(50),
})

type FormType="sign-in" | "sign-up"

const authFormSchema = (formType: FormType) => {
  return z.object({
    Email: z.string().min(1).max(50).email("Invalid email address"),
    fullName: formType === "sign-up" ? z.string().min(2).max(50) : z.string().optional(),
  })
}

const AuthForm = ({type}:{type:FormType}) => {
  const formSchema = authFormSchema(type)
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [accountId, setAccountId] = React.useState<string | null>(null)
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      Email: "",
    },
  })
 
  // 2. Define a submit handler.
  const onSubmit=async(values: z.infer<typeof formSchema>)=> {
    setIsLoading(true);
    setErrorMessage('');
    try{
      const user=await createAccount({
        fullName: values.fullName|| "",
        email: values.Email,
      });
      setAccountId(user.accountId);
    }catch(error:any){
      setErrorMessage('Failed to create an account! Please try again.'); 
    }finally{
      setIsLoading(false);
    }
    
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          {type==="sign-up" && <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className='shad-form-label'>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" className='shad-input' {...field} />
                  </FormControl>
                </div>
                <FormMessage className='shad-form-message'/>
              </FormItem>
            )}
          />
          }
          <FormField
              control={form.control}
              name="Email"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className='shad-form-label'>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" className='shad-input' {...field} />
                    </FormControl>
                  </div>
                  <FormMessage className='shad-form-message'/>
                </FormItem>
              )}
            /> 

          <Button type="submit" className='form-submit-button' disabled={isLoading}>
            {type==='sign-in'?'Sign-in':'Sign-up'}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="Loading..."
                width={24}
                height={24}
                className="ml-2 animate-spin"/>
            )}
            </Button>
            {errorMessage && (
              <p className='error-message'> *{errorMessage}</p>
            )}
            <div className="body-2 flex justify-center">
              <p className="text-light-100">
                {type==="sign-in" ? "Don't have an account?" : "Already have an account?"}
              </p>
              <Link
                href={type==="sign-in" ? "/sign-up" : "/sign-in"}
                className="text-brand font-medium ml-1">
                {type==="sign-in" ? "Sign Up" : "Sign In"}
                </Link>
              </div>

        </form>
      </Form>
    </>
  )
}

export default AuthForm