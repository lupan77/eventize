import { PrismaClient, EventStatus, InputType, QuestionKind, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((value) => value.trim()).filter(Boolean);
  const seedAdminEmail = process.env.SEED_ADMIN_EMAIL || adminEmails[0];

  if (seedAdminEmail) {
    await prisma.user.upsert({
      where: { email: seedAdminEmail },
      update: { role: UserRole.ADMIN, name: "Admin Eventize" },
      create: {
        email: seedAdminEmail,
        name: "Admin Eventize",
        role: UserRole.ADMIN
      }
    });
  }

  const event = await prisma.event.upsert({
    where: { slug: "aperitivo-tech-milano" },
    update: {},
    create: {
      title: "Aperitivo Tech Milano",
      slug: "aperitivo-tech-milano",
      summary: "Evento community gratuito per professionisti, studenti e appassionati di tecnologia.",
      description: "Un incontro serale informale per fare networking, ascoltare brevi talk e conoscere la community.",
      startsAt: new Date("2026-09-15T18:30:00.000Z"),
      endsAt: new Date("2026-09-15T21:30:00.000Z"),
      locationName: "Spazio Eventi Milano",
      locationAddress: "Via Esempio 10, Milano",
      status: EventStatus.PUBLISHED,
      registrationsOpen: true
    }
  });

  const questionsCount = await prisma.eventQuestion.count({ where: { eventId: event.id } });

  if (questionsCount === 0) {
    await prisma.eventQuestion.createMany({
      data: [
        {
          eventId: event.id,
          kind: QuestionKind.STANDARD,
          fieldKey: "company",
          label: "Azienda / organizzazione",
          description: "Facoltativo, utile per capire il tipo di pubblico presente.",
          inputType: InputType.TEXT,
          required: false,
          sortOrder: 10,
          isActive: true
        },
        {
          eventId: event.id,
          kind: QuestionKind.CUSTOM,
          fieldKey: null,
          label: "Parteciperai alla cena post-evento?",
          description: "Se selezioni sì, vedrai il link alla colletta PayPal per anticipare la tua quota.",
          inputType: InputType.RADIO,
          required: true,
          sortOrder: 20,
          isActive: true
        }
      ]
    });

    const dinnerQuestion = await prisma.eventQuestion.findFirstOrThrow({
      where: { eventId: event.id, label: "Parteciperai alla cena post-evento?" }
    });

    const yes = await prisma.eventQuestionOption.create({
      data: {
        questionId: dinnerQuestion.id,
        label: "Sì",
        value: "yes",
        sortOrder: 1
      }
    });

    await prisma.eventQuestionOption.create({
      data: {
        questionId: dinnerQuestion.id,
        label: "No",
        value: "no",
        sortOrder: 2
      }
    });

    await prisma.eventOptionHelper.create({
      data: {
        optionId: yes.id,
        helperTitle: "Colletta PayPal attiva",
        helperDescription: "Per chi partecipa alla cena post-evento è attiva una colletta PayPal per raccogliere in anticipo le quote e confermare la prenotazione.",
        purposeLabel: "Contributo per la cena post-evento",
        linkUrl: "https://www.paypal.com/paypalme/example",
        linkLabel: "Apri la colletta PayPal"
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
