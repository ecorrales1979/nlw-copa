import { FastifyInstance } from "fastify";
import { number, z } from "zod";

import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();

    return { count };
  });

  fastify.post(
    "/polls/:pollId/games/:gameId/guesses",
    { onRequest: authenticate },
    async (request, response) => {
      const getParams = z.object({
        pollId: z.string(),
        gameId: z.string(),
      });

      const createGuessBody = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number(),
      });

      const { gameId, pollId } = getParams.parse(request.params);
      const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(
        request.body
      );

      const participant = await prisma.participant.findUnique({
        where: { userId_pollId: { pollId, userId: request.user.sub } },
      });

      if (!participant) {
        return response.status(403).send({
          message: "You are not participating on this poll",
        });
      }

      const guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            participantId: participant.id,
            gameId,
          },
        },
      });

      if (guess) {
        return response.status(403).send({
          message: "You already send a guess to this game on this poll",
        });
      }

      const game = await prisma.game.findUnique({
        where: { id: gameId },
      });

      if (!game) {
        return response.status(404).send({
          message: "Game not found",
        });
      }

      if (game.date < new Date()) {
        return response.status(400).send({
          message: "You cannot make a guess after the game date",
        });
      }

      // return {
      //   gameId,
      //   participantId: request.user.sub,
      //   firstTeamPoints,
      //   secondTeamPoints,
      // };

      await prisma.guess.create({
        data: {
          gameId,
          participantId: participant?.id as string,
          firstTeamPoints,
          secondTeamPoints,
        },
      });

      return response.status(201).send();
    }
  );
}
