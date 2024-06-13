'use client'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { verifyCodeSchema } from "@/schemas/verifyCode.schema"
import { ApiResponse } from "@/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"
  

export default function VerifyAccount() {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof verifyCodeSchema>>({
        resolver: zodResolver(verifyCodeSchema),
    })

    const onSubmit = async (data: z.infer<typeof verifyCodeSchema>) => {
        try {
            setLoading(true)
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            });

            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace('/sign-in')
        } catch (error) {
            console.log("Error in Verification of User code", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message
            toast({
                title: "Verification failed",
                description: errorMessage,
                variant: "destructive"
            })

        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verify Your Email</FormLabel>
                  <FormControl>
                    <InputOTP pattern={REGEXP_ONLY_DIGITS} maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSeparator />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the verification code sent to your Email.
                  </FormDescription>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
     
            <Button className="rounded-sm bg-gray-900" type="submit">Submit</Button>
          </form>
        </Form>
        </div>
        </div>
      )
}
