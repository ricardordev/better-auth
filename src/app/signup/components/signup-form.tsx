"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";

const signupSchema = z
    .object({
        name: z.string().min(3, { message: "Name must be at least 3 characters" }),
        email: z.string().email({ message: "Invalid email" }),
        password: z.string().min(8, { message: "Password must be at least 8 characters" }),
        confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    })

type SignupFormValues = z.infer<typeof signupSchema>

export function SignupForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(formData: SignupFormValues) {
        const { } = await authClient.signUp.email({
            name: formData.name,
            email: formData.email,
            password: formData.password
        }, {
            onRequest: () => {
                setIsLoading(true);
            },
            onSuccess: () => {
                toast.success("Signed up successfully");
                router.replace("/dashboard");
                setIsLoading(false);
            },
            onError: (ctx) => {
                toast.error(ctx.response?.statusText || ctx.error.message);
                setIsLoading(false);
            }
        });

    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <div className="grid gap-2">
                <label className="flex items-center gap-2 text-sm leading-none text-zinc-400 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" htmlFor="name">Name</label>

                <input type="name" id="name" disabled={isLoading} className="flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 bg-zinc-900 text-zinc-100 border-zinc-700 placeholder:text-zinc-500 selection:bg-blue-900/50 selection:text-blue-50 focus-visible:border-blue-400 focus-visible:ring-[3px] focus-visible:ring-blue-400/30 aria-invalid:border-red-400 aria-invalid:ring-red-400/40" placeholder="Your full name" {...form.register("name")} aria-invalid={form.formState.errors.name ? "true" : "false"} />

                {form.formState.errors.name && (
                    <p
                        className="text-destructive text-sm"
                    >
                        {form.formState.errors.name.message}
                    </p>
                )}
            </div>

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

            <div className="grid gap-2 relative">
                <label className="flex items-center gap-2 text-sm leading-none text-zinc-400 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" htmlFor="confirmPassword">Confirm Password</label>

                <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" disabled={isLoading} className="flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 bg-zinc-900 text-zinc-100 border-zinc-700 placeholder:text-zinc-500 selection:bg-blue-900/50 selection:text-blue-50 focus-visible:border-blue-400 focus-visible:ring-[3px] focus-visible:ring-blue-400/30 aria-invalid:border-red-400 aria-invalid:ring-red-400/40" placeholder="••••••••" {...form.register("confirmPassword")} aria-invalid={form.formState.errors.confirmPassword ? "true" : "false"} />

                    <button
                        type="button"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                    </button>
                </div>

                {form.formState.errors.confirmPassword && (
                    <p
                        className="text-destructive text-sm"
                    >
                        {form.formState.errors.confirmPassword.message}
                    </p>
                )}
            </div>

            <button type="submit" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-full bg-zinc-200 text-zinc-900 shadow-xs hover:bg-zinc-200/80 h-9 px-4 py-2 has-[>svg]:px-3" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing up...
                    </>
                ) : (
                    "Sign up"
                )}
            </button>
        </form>
    )
}