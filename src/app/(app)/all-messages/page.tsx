"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ApiResponse } from "@/types/apiResponse"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import dayjs from 'dayjs';
import { useRouter } from "next/navigation"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"


export default function Page() {

    const [messages, setMessages] = useState<[{ _id: any, username: string, message: string, createdAt: Date }]>()
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const { toast } = useToast()
    const router = useRouter()

    const { data: session } = useSession()

    const fetchMessages = useCallback(async (pageNumber: number, refresh: boolean = false) => {
        setIsLoading(true)

        try {
            const response = await axios.get(`/api/getAll-messages?page=${pageNumber}`)
            setMessages(response.data.messages || [])
            setTotalPages(response.data.totalPages || 1)
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
    }, [setIsLoading, setMessages, toast])

    useEffect(() => {
        if (!session || !session.user) return
        fetchMessages(page)
    }, [session, page, fetchMessages])

    const handleNextPage = () => {
        if (page < totalPages) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchMessages(nextPage);
        }
    }

    const handlePrevPage = () => {
        if (page > 1) {
            const prevPage = page - 1;
            setPage(prevPage);
            fetchMessages(prevPage);
        }
    }

    const handleGivenPage = (pageNumber: number) => {
        setPage(pageNumber);
        fetchMessages(pageNumber);
    }

    if (!session || !session.user) {
        return <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-center text-gray-700">
                Please Log In!
            </h1>
        </div>
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">All messages</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">What is everyone talking about...</h2>{' '}
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(page, true);
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
            <div className="mt-5 flex justify-between">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={() => handlePrevPage()} />
                    </PaginationItem>

                    {page < totalPages ? (<> <PaginationItem>
                        <PaginationLink href="#" isActive  onClick={() => handleGivenPage(page+1)}>{page}</PaginationLink>
                    </PaginationItem><PaginationItem>
                            <PaginationLink href="#" onClick={() => handleGivenPage(page+1)}>
                                {page + 1}
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem></>) : <><PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem> <PaginationItem>
                            <PaginationLink href="#" isActive >{page}</PaginationLink>
                        </PaginationItem></>}
                    <PaginationItem>
                        <PaginationNext href="#" onClick={() => handleNextPage()} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            </div>
            
        </div>
    );
}
