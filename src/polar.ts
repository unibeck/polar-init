import { Polar } from "@polar-sh/sdk";

export const createClient = (accessToken: string) => new Polar({
    accessToken,
    server: 'sandbox'
})