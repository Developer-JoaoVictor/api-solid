import z from 'zod'
import { prisma } from '@/lib/prisma'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerSchemaBody = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerSchemaBody.parse(request.body)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password,
    },
  })

  return reply.status(201).send()
}
