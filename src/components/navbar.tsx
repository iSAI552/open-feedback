'use client'
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "./ui/button"
import { Check, ChevronsUpDown, ContactRoundIcon, Forward, MailIcon, PencilIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from 'axios'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { useEffect, useMemo, useState } from "react"
import { ApiResponse } from "@/types/apiResponse"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { cn } from "@/lib/utils"

const getAllUsernames = async () => {
    const response = await axios.get('api/all-usernames')
    return response.data.usernames.map((user: any) => user.username) || ["No usernames found"]
}


function UsernameDialogBox() {
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
                            {/* <Label htmlFor="username" className="sr-only">
                                Link
                            </Label>
                            <Input
                                id="username"
                                placeholder="Username"
                                onChange={(e) => setUsername(e.target.value)}
                            /> */}
                            <ComboboxDemo />
                        </div>
                        {/* <Button onClick={() => {
                            router.push(`u/${username}`)
                            router.refresh()
                        }}>
                            <span className="sr-only">Go</span>
                            <Forward className="h-4 w-4 to-primary" />
                        </Button> */}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

async function handelSubmit(newUsername: string) {

    try {
        const response = await axios.post<ApiResponse>('api/update-profile', {
            newUsername
        })
        if (response.data.success) {
            alert("Username updated successfully")
            signOut()
        }

    } catch (error) {
        alert("Username already taken")

        console.log("Something went wrong while updating the username", error)
    }
}

function UpdateDialogBox() {
    const { data: session } = useSession()
    const [name, setName] = useState(session?.user.username || "")



    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="w-12 h-12" variant="ghost"><PencilIcon /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you are done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Username
                            </Label>
                            <Input
                                id="username"
                                defaultValue={name}
                                className="col-span-3"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter >
                        <Button onClick={() => {
                            handelSubmit(name)
                        }}
                            type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    )
}

function ComboboxDemo() {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const router = useRouter()
    const [usernames, setUsernames] = useState<string[]>([])
    useEffect(() => {
        getAllUsernames().then((data) => setUsernames(data))
    }, [])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <div className="justify-center flex">
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {value
                            ? usernames.find((username) => username === value)
                            : "Select Username..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0">
                    <Command>
                        <CommandInput placeholder="Search usernames..." />
                        <CommandList>
                            <CommandEmpty>No Username found.</CommandEmpty>
                            <CommandGroup>
                                {usernames.map((username) => (
                                    <CommandItem
                                        key={username}
                                        value={username}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === username ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {username}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
                <Button className="ml-2" onClick={() => {
                    router.push(`u/${value}`)
                    router.refresh()
                }}>
                    <span className="sr-only">Go</span>
                    <Forward className="h-4 w-4 to-primary" />
                </Button>
            </div>
        </Popover>
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
                            <div className="flex items-center">Welcome, {user?.username || user?.email} <UpdateDialogBox /></div>
                            <div className="flex">
                                <UsernameDialogBox />
                                <Button variant="ghost" className="w-full md:w-auto mr-4 ml-4" onClick={() => router.replace('/dashboard')}><ContactRoundIcon /></Button>
                                <Button variant="outline" className="w-full md:w-auto" onClick={() => signOut()}>Logout</Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex">
                            <UsernameDialogBox />
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