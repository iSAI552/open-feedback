'use client'
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "./ui/button"
import { ContactRoundIcon, Forward, MailIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { useState } from "react"

function DialogBox() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild >
                    <Button variant="ghost"><MailIcon /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Anonymous message</DialogTitle>
                        <DialogDescription>
                            Share an anonymous message with:
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="username" className="sr-only">
                                Link
                            </Label>
                            <Input
                                id="username"
                                placeholder="Username"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => router.push(`u/${username}`)}>
                        <span className="sr-only">Go</span>
                            <Forward className="h-4 w-4 to-primary" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default function Navbar() {

    const { data: session } = useSession()
    const user = session?.user as User
    const router = useRouter()


    return (
        <nav className="p-4 md:p-6 shadow-md">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="/" className="text-xl font-bold mb-4 md:mb-0">Open Feedback</a>
                {
                    session ? (
                        <>
                            <span className="mr-4">Welcome, {user?.username || user?.email}</span>
                            <div className="flex">
                                <DialogBox />
                                <Button variant="ghost" className="w-full md:w-auto mr-4 ml-4" onClick={() => router.replace('/dashboard')}><ContactRoundIcon /></Button>
                                <Button variant="outline" className="w-full md:w-auto" onClick={() => signOut()}>Logout</Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex">
                        <DialogBox />
                        <Link className="ml-4" href='/sign-in'>
                            <Button className="w-full md:w-auto">Login</Button>
                        </Link>
                        </div>
                    )
                }
            </div>
        </nav>
    )
}