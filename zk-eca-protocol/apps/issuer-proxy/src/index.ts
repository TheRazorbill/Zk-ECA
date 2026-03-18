import Fastify from "fastify";
import cors from "@fastify/cors";
import {
  createAgeProofPayload,
  createIssuerChallenge,
  verifyAgeProof,
} from "@repo/crypto-core";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true,
});

app.get("/health", async () => {
  return {
    status: "ok",
    service: "issuer-proxy",
    now: new Date().toISOString(),
  };
});

app.post("/govbr/challenge", async () => {
  return {
    challenge: createIssuerChallenge(),
  };
});

app.post<{ Body: { challenge: string; birthYear: number; minimumAge?: number } }>(
  "/proof/issue",
  async (request, reply) => {
    const { challenge, birthYear, minimumAge = 18 } = request.body;

    if (!challenge || !Number.isInteger(birthYear)) {
      return reply.status(400).send({ error: "invalid_payload" });
    }

    const age = new Date().getFullYear() - birthYear;
    const payload = createAgeProofPayload({
      challenge,
      isOverMinimumAge: age >= minimumAge,
    });

    return {
      proof: payload,
    };
  },
);

app.post<{ Body: { proof: string; challenge: string; minimumAge?: number } }>(
  "/proof/verify",
  async (request) => {
    const { proof, challenge, minimumAge = 18 } = request.body;

    return verifyAgeProof({
      proof,
      challenge,
      minimumAge,
    });
  },
);

const port = Number(process.env.PORT ?? "3002");

try {
  await app.listen({
    port,
    host: "0.0.0.0",
  });
  app.log.info(`issuer-proxy listening on :${port}`);
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
