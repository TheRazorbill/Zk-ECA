export type AgeProofPayloadInput = {
  challenge: string;
  isOverMinimumAge: boolean;
};

export type VerifyAgeProofInput = {
  proof: string;
  challenge: string;
  minimumAge?: number;
};

function randomChallenge() {
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createIssuerChallenge() {
  return randomChallenge();
}

export function createAgeProofPayload(input: AgeProofPayloadInput) {
  return JSON.stringify({
    challenge: input.challenge,
    isOverMinimumAge: input.isOverMinimumAge,
    generatedAt: Date.now(),
    scheme: "zk-eca-demo-v1",
  });
}

export function verifyAgeProof(input: VerifyAgeProofInput) {
  try {
    const parsed = JSON.parse(input.proof) as {
      challenge?: string;
      isOverMinimumAge?: boolean;
      generatedAt?: number;
      scheme?: string;
    };

    const isValidScheme = parsed.scheme === "zk-eca-demo-v1";
    const isSameChallenge = parsed.challenge === input.challenge;

    return {
      valid: Boolean(
        isValidScheme &&
          isSameChallenge &&
          typeof parsed.isOverMinimumAge === "boolean",
      ),
      isOverMinimumAge: parsed.isOverMinimumAge ?? false,
      minimumAge: input.minimumAge ?? 18,
      reason: isValidScheme && isSameChallenge ? undefined : "invalid_proof",
    };
  } catch {
    return {
      valid: false,
      isOverMinimumAge: false,
      minimumAge: input.minimumAge ?? 18,
      reason: "malformed_proof",
    };
  }
}
