import Link from "next/link"
import { SigninForm } from "./signin/components/signin-form"
import { enabledProviders } from "@/lib/auth"

export default function Home() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-200">Login</h1>
          <p className="mt-2 text-sm text-zinc-400">Enter your credentials to access your account</p>
        </div>

        <SigninForm enabledProviders={enabledProviders} />

        <div className="text-center text-sm text-zinc-400">
          <p>
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-primary text-zinc-200 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}