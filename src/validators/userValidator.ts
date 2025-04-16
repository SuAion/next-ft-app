import { z } from 'zod'

export const SignupFormSchema = z.object({
  email: z.string().email('邮箱格式错误'),
  password: z.string().min(6, '密码不能少于6位'),
  name: z.string().optional(),
})

export const LoginFormSchema = z.object({
  email: z.string().email('邮箱格式错误'),
  password: z.string().min(6, '密码不能少于6位'),
})
