import { UsersRepository } from '@/repositories/users-repository'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface AutheticateUseCaseRequest {
  email: string
  password: string
}
interface AuthenticateUseCaseReponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AutheticateUseCaseRequest): Promise<AuthenticateUseCaseReponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}
