import { z } from "zod";

export const FormSchema = z.object({
    label: z.string({
        required_error: "Le nom est requise",
    }),
    times: z.string({
        required_error: "Le temps est requis",
    }),
    description: z.string({
        required_error: "La description est requise",
    }),
    inspiration: z.coerce.number({
        required_error: "Le temps d'inspiration est requis",
    }),
    expiration: z.coerce.number({
        required_error: "Le temps d'expiration est requis",
    }),
    apnea: z.coerce.number({
        required_error: "Le temps d'apnée est requis",
    }),
})