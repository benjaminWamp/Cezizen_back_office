import { z } from "zod";

export const FormSchema = z.object({
    title: z.string({
        required_error: "Le titre est requise",
    }),
    description: z.string({
        required_error: "La description est requise",
    }),
    maxParticipant: z.coerce.number({
        required_error: "Le nombre de participant est requise",
    }),
    nbParticipant: z.coerce.number({
        required_error: "La description est requise",
    }),
    deadLine: z.string({
        required_error: "La description est requise",
    }),
    categoryId: z.string({
        required_error: "La catégorie est requise",
    }),
    isValidate: z.boolean().optional(),
    typeRessourceId: z.string({
        required_error: "Le type de ressource est requis",
    }),
    steps: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        order: z.number().min(1),
      })).optional(),
})