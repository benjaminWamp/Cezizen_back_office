import { z } from "zod";

export const FormSchema = z.object({
    label: z.string({
        required_error: "Le nom est requis",
    }),

})