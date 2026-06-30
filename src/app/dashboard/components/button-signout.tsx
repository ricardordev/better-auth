"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export function ButtonSignOut() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();

    async function signOut() {
        setIsLoading(true);
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Saindo...");
                    router.replace("/");
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                }
            }
        })
    }

    return (
        <button onClick={signOut} disabled={isLoading} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-full bg-zinc-200 text-zinc-900 shadow-xs hover:bg-zinc-200/80 h-9 px-4 py-2 has-[>svg]:px-3">
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                </>
            ) : (
                "Logout"
            )}
        </button>
    );
}