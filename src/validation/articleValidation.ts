import { z } from "zod";

export const FormSchema = z.object({
    label: z.string({
        required_error: "Le titre est requise",
    }),
    description: z.string({
        required_error: "La description est requise",
    }),
    content: z.string({
        required_error: "Le nombre de participant est requise",
    }),
    categoryId: z.coerce.number({
        required_error: "La catégorie est requise",
    }),
})