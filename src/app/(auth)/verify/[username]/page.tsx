'use client'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { verifyCodeSchema } from "@/schemas/verifyCode.schema"
import { ApiResponse } from "@/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function VerifyAccount() {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const { toast } = useToast()

    const register = useForm<z.infer<typeof verifyCodeSchema>>({
        resolver: zodResolver(verifyCodeSchema),
    })

    const onSubmit = async (data: z.infer<typeof verifyCodeSchema>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            });

            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace('sign-in')
        } catch (error) {
            console.log("Error in Verification of User code", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message
            toast({
                title: "Verification failed",
                description: errorMessage,
                variant: "destructive"
            })

        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent your email</p>
                </div>
                <Form {...register}>
          <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
          name="code"
          control={register.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input  placeholder="code" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your email
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Verify</Button>
          </form>
        </Form>
            </div>
        </div>
    )
}
