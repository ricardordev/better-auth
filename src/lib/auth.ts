import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

type ProviderConfig = {
    clientId: string;
    clientSecret: string;
};

const PROVIDER_DEFINITIONS = [
    { key: "twitch", clientId: process.env.TWITCH_CLIENT_ID, clientSecret: process.env.TWITCH_CLIENT_SECRET },
    { key: "twitter", clientId: process.env.TWITTER_CLIENT_ID, clientSecret: process.env.TWITTER_CLIENT_SECRET },
    { key: "github", clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET },
] as const;

const socialProviders: Record<string, ProviderConfig> = {};

for (const { key, clientId, clientSecret } of PROVIDER_DEFINITIONS) {
    if (clientId && clientSecret) {
        socialProviders[key] = { clientId, clientSecret };
    }
}

export const enabledProviders = PROVIDER_DEFINITIONS
    .filter(({ clientId, clientSecret }) => clientId && clientSecret)
    .map(({ key }) => key);

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    socialProviders: Object.keys(socialProviders).length > 0 ? socialProviders : undefined,
});
