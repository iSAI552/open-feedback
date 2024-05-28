"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ApiResponse } from "@/types/apiResponse"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import dayjs from 'dayjs';

export default function Page() {

    const [messages, setMessages] = useState<[{ _id: any, username: string, message: string, createdAt: Date }]>()
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const { data: session } = useSession()

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        try {
            const response = await axios.get('/api/getAll-messages')
            setMessages(response.data.messages || [])
            if (refresh) {
                toast({
                    title: "Refreshed the messages",
                    description: "Showing the latest messages"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch message settings",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setIsLoading, setMessages])

    useEffect(() => {
        if (!session || !session.user) return
        fetchMessages()
    }, [session, fetchMessages])

    if (!session || !session.user) {
        return <div>Please Log In</div>
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">All messages</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">What is everyone talking about</h2>{' '}
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages && messages.length > 0 ? (
                    messages.map((message, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>{message.message}</CardTitle>
                                <CardDescription>@{message.username}</CardDescription>
                                <div className="text-sm">
                                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                                </div>
                            </CardHeader>
                        </Card>

                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    );
}
