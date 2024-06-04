'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signIn.schema"
import { signIn } from "next-auth/react"

export default function Page () {

  const {toast} = useToast()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)

  // zod implementation

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password
    })
    if(result?.error){
      setIsSubmitting(false)
      form.reset({ ...form.getValues(), identifier: '', password: '' });
        toast({
            title: "Login failed",
            description: "Incorrect username or password",
            variant: "destructive"
        })
    }

    if(result?.url){
        router.replace('/all-messages')
    }

  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to Open Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
          name="identifier"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username / Email</FormLabel>
              <FormControl>
                <Input placeholder="username/email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your password.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {
            isSubmitting ? (
              <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
              </>
            ) : ( "Sign In" )
          }
          </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            New to open-feedback?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign Up
            </Link>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Want to know more about us?{' '}
            <Link href="/" className="text-blue-500 hover:text-blue-800">
              Open Feedback
            </Link>
          </p>
        </div>

        </div>
      </div>
  )
}