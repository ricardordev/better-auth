"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Resolver } from "react-hook-form"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "react-toastify";

import { TwitchLogo, XLogo, GithubLogo } from "@phosphor-icons/react";

import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

type SigninFormProps = {
    enabledProviders: {
        twitch: boolean;
        twitter: boolean;
        github: boolean;
    };
}

export function SigninForm({ enabledProviders }: SigninFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingTwitch, setIsLoadingTwitch] = useState(false)
    const [isLoadingTwitter, setIsLoadingTwitter] = useState(false)
    const [isLoadingGithub, setIsLoadingGithub] = useState(false)
    const router = useRouter()

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function handleLoginWithTwitch() {
        await authClient.signIn.social({
            provider: "twitch",
            callbackURL: "/dashboard"
        }, {
            onRequest: () => {
                setIsLoadingTwitch(true);
            },
            onSuccess: () => {

            },
            onError: (ctx) => {
                toast.error(ctx.response?.statusText || ctx.error.message);
                setIsLoadingTwitch(false);
            }
        })
    }

    async function handleLoginWithTwitter() {
        await authClient.signIn.social({
            provider: "twitter",
            callbackURL: "/dashboard"
        }, {
            onRequest: () => {
                setIsLoadingTwitter(true);
            },
            onSuccess: () => {

            },
            onError: (ctx) => {
                toast.error(ctx.response?.statusText || ctx.error.message);
                setIsLoadingTwitter(false);
            }
        })
    }

    async function handleLoginWithGithub() {
        await authClient.signIn.social({
            provider: "github",
            callbackURL: "/dashboard"
        }, {
            onRequest: () => {
                setIsLoadingGithub(true);
            },
            onSuccess: () => {

            },
            onError: (ctx) => {
                toast.error(ctx.response?.statusText || ctx.error.message);
                setIsLoadingGithub(false);
            }
        })
    }

    async function onSubmit(formData: LoginFormValues) {
        const { } = await authClient.signIn.email({
            email: formData.email,
            password: formData.password,
            callbackURL: "/dashboard"
        }, {
            onRequest: () => {
                setIsLoading(true);
            },
            onSuccess: () => {
                toast.success("Signed in successfully");
            },
            onError: (ctx) => {
                toast.error(ctx.response?.statusText || ctx.error.message);
                setIsLoading(false);
            }
        })
    }

    const hasSocialProviders = enabledProviders.twitch || enabledProviders.twitter || enabledProviders.github;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-2">
                <label className="flex items-center gap-2 text-sm leading-none text-zinc-400 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" htmlFor="email">E-mail</label>

                <input type="email" id="email" disabled={isLoading} className="flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 bg-zinc-900 text-zinc-100 border-zinc-700 placeholder:text-zinc-500 selection:bg-blue-900/50 selection:text-blue-50 focus-visible:border-blue-400 focus-visible:ring-[3px] focus-visible:ring-blue-400/30 aria-invalid:border-red-400 aria-invalid:ring-red-400/40" placeholder="your@email.com" {...form.register("email")} aria-invalid={form.formState.errors.email ? "true" : "false"} />

                {form.formState.errors.email && (
                    <p
                        className="text-destructive text-sm"
                    >
                        {form.formState.errors.email.message}
                    </p>
                )}
            </div>

            <div className="grid gap-2 relative">
                <label className="flex items-center gap-2 text-sm leading-none text-zinc-400 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" htmlFor="password">Password</label>

                <div className="relative">
                    <input type={showPassword ? "text" : "password"} id="password" disabled={isLoading} className="flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 bg-zinc-900 text-zinc-100 border-zinc-700 placeholder:text-zinc-500 selection:bg-blue-900/50 selection:text-blue-50 focus-visible:border-blue-400 focus-visible:ring-[3px] focus-visible:ring-blue-400/30 aria-invalid:border-red-400 aria-invalid:ring-red-400/40" placeholder="••••••••" {...form.register("password")} aria-invalid={form.formState.errors.password ? "true" : "false"} />

                    <button
                        type="button"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </button>
                </div>

                {form.formState.errors.password && (
                    <p
                        className="text-destructive text-sm"
                    >
                        {form.formState.errors.password.message}
                    </p>
                )}
            </div>

            <button type="submit" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-full bg-zinc-200 text-zinc-900 shadow-xs hover:bg-zinc-200/80 h-9 px-4 py-2 has-[>svg]:px-3" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                    </>
                ) : (
                    "Sign in"
                )}
            </button>

            {hasSocialProviders && (
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-zinc-950 px-2 text-zinc-400">Or continue with</span>
                    </div>
                </div>
            )}

            {enabledProviders.twitch && (
                <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none aria-invalid:border-destructive h-9 px-4 py-2 w-full mb-1 bg-[#9146FF] border-[1px] border-zinc-700 text-white hover:bg-[#9146FF]/80 hover:text-white hover:border-zinc-700"
                    onClick={handleLoginWithTwitch}
                    disabled={isLoadingTwitch}
                >
                    {isLoadingTwitch ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in with Twitch...
                        </>
                    ) : (
                        <>
                            <TwitchLogo className="mr-2 h-4 w-4" />
                            Sign in with Twitch
                        </>
                    )}
                </button>
            )}

            {enabledProviders.twitter && (
                <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none aria-invalid:border-destructive h-9 px-4 py-2 w-full mb-1 bg-[#000000] border-[1px] border-zinc-700 text-white hover:bg-[#101010] hover:text-white hover:border-zinc-700"
                    onClick={handleLoginWithTwitter}
                    disabled={isLoadingTwitter}
                >
                    {isLoadingTwitter ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in with X...
                        </>
                    ) : (
                        <>
                            <XLogo className="mr-2 h-4 w-4" />
                            Sign in with X
                        </>
                    )}
                </button>
            )}

            {enabledProviders.github && (
                <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none aria-invalid:border-destructive h-9 px-4 py-2 w-full mb-1 bg-[#0d1117] border-[1px] border-zinc-700 text-white hover:bg-[#101010] hover:text-white hover:border-zinc-700"
                    onClick={handleLoginWithGithub}
                    disabled={isLoadingGithub}
                >
                    {isLoadingGithub ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in with Github...
                        </>
                    ) : (
                        <>
                            <GithubLogo className="mr-2 h-4 w-4" />
                            Sign in with Github
                        </>
                    )}
                </button>
            )}
        </form>
    )
}