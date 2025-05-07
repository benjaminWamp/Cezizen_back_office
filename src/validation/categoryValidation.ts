import { z } from "zod";

export const FormSchema = z.object({
    name: z.string({
        required_error: "Le nom est requis",
    }),
    description: z.string({
        required_error: "La description est requise",
    }),
})