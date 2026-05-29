import { prisma } from '@/lib/db'

type Step = { type: string; config: Record<string, unknown> }

export async function tickJourneys() {
  const now = new Date()
  const enrollments = await prisma.journeyEnrollment.findMany({
    where: { status: 'active' },
    include: { journey: true },
  })
  for (const e of enrollments) {
    const steps = (e.journey.steps as Step[]) ?? []
    if (e.currentStep >= steps.length) {
      await prisma.journeyEnrollment.update({ where: { id: e.id }, data: { status: 'completed' } })
      continue
    }
    const step = steps[e.currentStep]
    if (step.type === 'delay') {
      const due = new Date(e.updatedAt)
      due.setDate(due.getDate() + ((step.config.days as number) ?? 1))
      if (now >= due) await prisma.journeyEnrollment.update({ where: { id: e.id }, data: { currentStep: e.currentStep + 1 } })
    } else {
      await prisma.journeyEnrollment.update({ where: { id: e.id }, data: { currentStep: e.currentStep + 1 } })
    }
  }
}
