import { z } from 'zod'
import { t } from 'i18next';

export const RegisFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: t('validation.name_min_length') })
        .trim(),
    email: z.string().email({ message: t('validation.valid_email') }).trim(),
    password: z
        .string()
        .min(8, { message: t('validation.password_min_length') })
        .trim(),

})

export const SignupFormSchema = z.object({
    email: z.string().email({ message: t('validation.valid_email') }).trim(),
    password: z
        .string()
        .regex(/[^a-zA-Z0-9]/, {
            message: t('validation.special_char_required'),
        })
        .trim(),
})

