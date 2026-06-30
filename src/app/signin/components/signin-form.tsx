"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
    enabledProviders: readonly string[];
};

const PROVIDER_CONFIG: Record<string, { label: string; loadingLabel: string; bgColor: string; icon: React.ComponentType<{ className?: string }> }> = {
    twitch: {
        label: "Sign in with Twitch",
        loadingLabel: "Signing in with Twitch...",
        bgColor: "bg-[#9146FF]",
        icon: TwitchLogo,
    },
    twitter: {
        label: "Sign in with X",
        loadingLabel: "Signing in with X...",
        bgColor: "bg-[#000000]",
        icon: XLogo,
    },
    github: {
        label: "Sign in with Github",
        loadingLabel: "Signing in with Github...",
        bgColor: "bg-[#0d1117]",
        icon: GithubLogo,
    },
};

export function SigninForm({ enabledProviders }: SigninFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
    const router = useRouter()

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function handleSocialLogin(provider: string) {
        await authClient.signIn.social({
            provider,
            callbackURL: "/dashboard"
        }, {
            onRequest: () => {
                setLoadingProvider(provider);
            },
            onSuccess: () => {
                // Redirect handled by Better Auth
            },
            onError: (ctx) => {
                toast.error(ctx.response?.statusText || ctx.error.message);
                setLoadingProvider(null);
            }
        })
    }

    async function onSubmit(formData: LoginFormValues) {
        await authClient.signIn.email({
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

    const hasSocialProviders = enabledProviders.length > 0;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-2">
                <label className="flex items-center gap-2 text-sm leading-none text-zinc-400 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" htmlFor="email">E-mail</label>

                <input type="email" id="email" disabled={isLoading} className="flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 bg-zinc-900 text-zinc-100 border-zinc-700 placeholder:text-zinc-500 selection:bg-blue-900/50 selection:text-blue-50 focus-visible:border-blue-400 focus-visible:ring-[3px] focus-visible:ring-blue-400/30 aria-invalid:border-red-400 aria-invalid:ring-red-400/40" placeholder="your@email.com" {...form.register("email")} aria-invalid={form.formState.errors.email ? "true" : "false"} />

                {form.formState.errors.email && (
                    <p className="text-destructive text-sm">
                        {form.formState.errors.email.message}
                    </p>
                )}
            </div>

            <div className="grid gap-2 relative">
                <label className="flex items-center gap-2 text-sm leading-none text-zinc-400 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" htmlFor="password">Password</label>

                <div className="relative">
                    <input type={showPassword ? "text" : "password"} id="password" disabled={isLoading} className="flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 bg-zinc-900 text-zinc-100 border-zinc-700 placeholder:text-zinc-500 selection:bg-blue-900/50 selection:text-blue-50 focus-visible:border-blue-400 focus-visible:ring-[3px] focus-visible:ring-blue-400/30 aria-invalid:border-red-400 aria-invalid:ring-red-400/40" placeholder="••••••••" {...form.register("password")} aria-invalid={form.formState.errors.password ? "true" : "false"} />

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
                    <p className="text-destructive text-sm">
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

            {enabledProviders.map((provider) => {
                const config = PROVIDER_CONFIG[provider];
                if (!config) return null;

                const isProviderLoading = loadingProvider === provider;
                const Icon = config.icon;

                return (
                    <button
                        key={provider}
                        type="button"
                        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none aria-invalid:border-destructive h-9 px-4 py-2 w-full mb-1 border-[1px] border-zinc-700 text-white hover:opacity-80 ${config.bgColor}`}
                        onClick={() => handleSocialLogin(provider)}
                        disabled={isProviderLoading}
                    >
                        {isProviderLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {config.loadingLabel}
                            </>
                        ) : (
                            <>
                                <Icon className="mr-2 h-4 w-4" />
                                {config.label}
                            </>
                        )}
                    </button>
                );
            })}
        </form>
    )
}