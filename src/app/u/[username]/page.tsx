"use client"
import { useToast } from "@/components/ui/use-toast"
import { z } from 'zod'
import { useParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { messageSchema } from "@/schemas/message.schema"
import { ApiResponse } from "@/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from "lucide-react"
import Navbar from "@/components/navbar"

export default function Page() {

    const { username } = useParams<{ username: string }>()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
    });

    const messageContent = form.watch('content');


    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>('/api/send-message', {
                ...data,
                username,
            });

            toast({
                title: response.data.message,
                variant: 'default',
            });
            form.reset({ ...form.getValues(), content: '' });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ?? 'Failed to sent message',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };




    return (
        <>
        <Navbar />
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
                <h1 className="text-4xl font-bold mb-6 text-center text-gray-700">
                    Public Profile Link
                </h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-500">Send Anonymous Message to @{username}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write your anonymous message here"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Please send a message of min 10 characters</FormDescription>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-center">
                            {isLoading ? (
                                <Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button type="submit" disabled={isLoading || !messageContent}>
                                    Send It
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </div>
        </div>
        </>
    )
}