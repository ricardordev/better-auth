import Link from "next/link"
import { SignupForm } from "./components/signup-form"

export default function Signup() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-zinc-200">Sign up</h1>
                    <p className="mt-2 text-sm text-zinc-400">Create your account to get started</p>
                </div>

                <SignupForm />

                <div className="text-center text-sm text-zinc-400">
                    <p>
                        Already have an account?{" "}
                        <Link href="/" className="font-medium text-zinc-200 hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}