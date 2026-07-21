import { prisma } from "@/lib/prisma";
import { EventStatus } from "@prisma/client";

export async function getPublishedEvents() {
  return prisma.event.findMany({
    where: { status: EventStatus.PUBLISHED },
    orderBy: { startsAt: "asc" }
  });
}

export async function getAllEvents() {
  return prisma.event.findMany({
    orderBy: { createdAt: "desc" }
  });
}

export async function getEventBySlug(slug: string) {
  return prisma.event.findUnique({
    where: { slug },
    include: {
      questions: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: {
          options: {
            orderBy: { sortOrder: "asc" },
            include: {
              helper: true
            }
          }
        }
      }
    }
  });
}

export async function getEventWithDetails(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { sortOrder: "asc" },
        include: {
          options: {
            orderBy: { sortOrder: "asc" },
            include: { helper: true }
          }
        }
      }
    }
  });
}

export async function getUserRegistrations(email: string) {
  return prisma.registration.findMany({
    where: { user: { email } },
    include: { event: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function getEventRegistrations(eventId: string) {
  return prisma.registration.findMany({
    where: { eventId },
    include: {
      user: true,
      answers: {
        include: { question: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}
