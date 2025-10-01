import z from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { registerUseCase } from '@/use-cases/register'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerSchemaBody = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerSchemaBody.parse(request.body)

  try {
    await registerUseCase({
      name,
      email,
      password,
    })
  } catch (error) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
