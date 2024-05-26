'use client'
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "./ui/button"
import { ContactRoundIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Navbar() {

    const { data: session } = useSession()
    const user = session?.user as User
    const router = useRouter()


    return (
        <nav className="p-4 md:p-6 shadow-md">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="/all-messages" className="text-xl font-bold mb-4 md:mb-0">Open Feedback</a>
                {
                    session ? (
                        <>
                            <span className="mr-4">Welcome, {user?.username || user?.email}</span>
                            <div className="flex ">
                            <Button className="w-full md:w-auto mr-4" onClick={() => router.replace('/dashboard')}><ContactRoundIcon/></Button>
                            <Button className="w-full md:w-auto" onClick={() => signOut()}>Logout</Button>
                            </div>
                        </>
                    ) : (
                        <Link href='/sign-in'>
                            <Button className="w-full md:w-auto">Login</Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}