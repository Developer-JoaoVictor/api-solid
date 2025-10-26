import { CheckInUseCase } from './check-in'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryChekInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let sut: CheckInUseCase
let gymsRepository: InMemoryGymsRepository
let checkInsRepository: InMemoryChekInsRepository

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryChekInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.4829671),
      longitude: new Decimal(-46.4977179),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.4829671,
      userLongitude: -46.4977179,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should note be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 9, 22, 7))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.4829671,
      userLongitude: -46.4977179,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -23.4829671,
        userLongitude: -46.4977179,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should note be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2025, 9, 22, 7))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.4829671,
      userLongitude: -46.4977179,
    })

    vi.setSystemTime(new Date(2025, 9, 23, 7))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.4829671,
      userLongitude: -46.4977179,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.484028),
      longitude: new Decimal(-46.4663354),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -23.4829671,
        userLongitude: -46.4977179,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
