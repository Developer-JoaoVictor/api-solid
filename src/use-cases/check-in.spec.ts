import { CheckInUseCase } from './check-in'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryChekInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

let checkInsRepository: InMemoryChekInsRepository
let sut: CheckInUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryChekInsRepository()
    sut = new CheckInUseCase(checkInsRepository)
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
