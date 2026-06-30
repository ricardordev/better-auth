import { headers } from "next/headers"
import { auth } from "@/lib/auth";
import { ButtonSignOut } from "./components/button-signout";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-zinc-200">Dashboard</h1>
                    <p className="mt-2 text-sm text-zinc-400">Your data safe here</p>
                </div>
                <div className="text-center">
                    <h3 className="mb-2 text-zinc-200 text-left w-full bg-zinc-800 p-3 rounded-md">Name: {session?.user?.name}</h3>
                    <h3 className="mb-2 text-zinc-200 text-left w-full bg-zinc-800 p-3 rounded-md">Email: {session?.user?.email}</h3>
                </div>
                <div className="text-center">
                    <ButtonSignOut />
                </div>
            </div>
        </div>
    );
}