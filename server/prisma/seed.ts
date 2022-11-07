import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@email.com",
      avatarUrl: "https://github.com/ecorrales1979.png",
    },
  });

  const poll = await prisma.poll.create({
    data: {
      title: "Example Pool",
      code: "BOL123",
      ownerId: user.id,
    },
  });

  const participant = await prisma.participant.create({
    data: {
      userId: user.id,
      pollId: poll.id,
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-25T12:30:00.000Z",
      firstTeamCountryCode: "GE",
      secondTeamCountryCode: "BR",
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-26T12:30:00.000Z",
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "AR",

      guesses: {
        create: {
          firstTeamPoints: 3,
          secondTeamPoints: 1,

          participant: {
            connect: {
              id: participant.id,
            },
          },
        },
      },
    },
  });
}

main();
