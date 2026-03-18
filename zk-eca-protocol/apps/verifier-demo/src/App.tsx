import { useMemo, useState } from "react";
import {
  createAgeProofPayload,
  createIssuerChallenge,
  verifyAgeProof,
} from "@repo/crypto-core";
import "./App.css";

type VerificationLogItem = {
  title: string;
  details: string;
  tone: "sensitive" | "neutral" | "safe";
};

type DiscordTokenPayload = {
  iss: "issuer-proxy";
  aud: "discord";
  scope: "age_verification";
  challenge: string;
  ageOverMinimum: boolean;
  iat: string;
};

function base64Url(value: string) {
  return btoa(unescape(encodeURIComponent(value)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function tinySignature(input: string) {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

function createSignedToken(payload: DiscordTokenPayload) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(JSON.stringify(payload));
  const signature = tinySignature(`${encodedHeader}.${encodedPayload}`);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function App() {
  const [cpf, setCpf] = useState("123.456.789-00");
  const [minimumAge, setMinimumAge] = useState(18);
  const [birthYear, setBirthYear] = useState(2000);
  const [challenge, setChallenge] = useState(createIssuerChallenge());
  const [runAt, setRunAt] = useState(() => new Date());

  const proof = useMemo(() => {
    const age = new Date().getFullYear() - birthYear;

    return createAgeProofPayload({
      challenge,
      isOverMinimumAge: age >= minimumAge,
    });
  }, [birthYear, challenge, minimumAge]);

  const result = useMemo(() => {
    return verifyAgeProof({
      proof,
      challenge,
      minimumAge,
    });
  }, [challenge, minimumAge, proof]);

  const tokenPayload = useMemo<DiscordTokenPayload>(() => {
    return {
      iss: "issuer-proxy",
      aud: "discord",
      scope: "age_verification",
      challenge,
      ageOverMinimum: result.valid && result.isOverMinimumAge,
      iat: runAt.toISOString(),
    };
  }, [challenge, result.isOverMinimumAge, result.valid, runAt]);

  const signedSuccessToken = useMemo(() => {
    return createSignedToken(tokenPayload);
  }, [tokenPayload]);

  const verificationLog = useMemo<VerificationLogItem[]>(() => {
    const log: VerificationLogItem[] = [
      {
        title: "1) issuer-proxy recebe o dado sensivel",
        details: `CPF recebido internamente: ${cpf}`,
        tone: "sensitive",
      },
      {
        title: "2) servidor valida elegibilidade",
        details: `Maior que ${minimumAge}? ${String(result.isOverMinimumAge)} (proof interna gerada)`,
        tone: "neutral",
      },
      {
        title: "3) discord recebe apenas token assinado",
        details: "Sem CPF, sem nome, sem data de nascimento.",
        tone: "safe",
      },
    ];

    return log;
  }, [cpf, minimumAge, result.isOverMinimumAge]);

  return (
    <main className="app-shell">
      <section className="presentation-card">
        <p className="badge">Verifier Demo</p>
        <h1>Log de Verificacao e Minimizacao de Dados</h1>
        <p className="subtitle">
          A mesma verificacao em dois contextos: no servidor fica o dado
          sensivel, no Discord chega somente um token de sucesso assinado.
        </p>

        <div className="controls top-controls">
          <label>
            CPF (somente no servidor)
            <input
              value={cpf}
              onChange={(event) => setCpf(event.target.value)}
              placeholder="000.000.000-00"
            />
          </label>
          <label>
            Idade minima exigida
            <input
              type="number"
              min={13}
              max={99}
              value={minimumAge}
              onChange={(event) => setMinimumAge(Number(event.target.value))}
            />
          </label>
          <label>
            Ano de nascimento (simulado)
            <input
              type="number"
              min={1900}
              max={new Date().getFullYear()}
              value={birthYear}
              onChange={(event) => setBirthYear(Number(event.target.value))}
            />
          </label>
        </div>

        <div className="challenge-row top-controls">
          <p>
            <strong>Challenge:</strong> {challenge.slice(0, 16)}...
          </p>
          <button
            type="button"
            onClick={() => {
              setChallenge(createIssuerChallenge());
              setRunAt(new Date());
            }}
          >
            Gerar nova challenge
          </button>
        </div>

        <section className="split-view">
          <article className="pane pane-server">
            <h2>Servidor issuer-proxy (lado sensivel)</h2>
            <p className="pane-note">Aqui o CPF existe e pode ser auditado.</p>
            <div className="proof-box">
              <h3>Payload interno recebido</h3>
              <pre>
                {JSON.stringify(
                  {
                    cpf,
                    birthYear,
                    minimumAge,
                    challenge,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
            <div className="proof-box">
              <h3>Proof interna</h3>
              <pre>{proof}</pre>
            </div>
          </article>

          <article className="pane pane-discord">
            <h2>Discord / Verifier (lado minimizado)</h2>
            <p className="pane-note">
              Recebe somente o token assinado de sucesso e o resultado.
            </p>
            <div className={`result ${result.valid ? "approved" : "rejected"}`}>
              <h3>{result.valid && result.isOverMinimumAge ? "Acesso liberado" : "Acesso negado"}</h3>
              <p>
                valid={String(result.valid)} | overMinimumAge=
                {String(result.isOverMinimumAge)}
              </p>
            </div>
            <div className="proof-box">
              <h3>Token assinado recebido pelo Discord</h3>
              <pre>{signedSuccessToken}</pre>
            </div>
            <div className="proof-box">
              <h3>Claims visiveis no Discord</h3>
              <pre>{JSON.stringify(tokenPayload, null, 2)}</pre>
            </div>
          </article>
        </section>

        <section className="log-panel">
          <h2>Log de Verificacao (foco da demo)</h2>
          <p>
            EX: o servidor processa o CPF,
            mas o verificador externo recebe apenas o token assinado.
          </p>
          <ul>
            {verificationLog.map((item) => (
              <li key={item.title} className={`log-item ${item.tone}`}>
                <strong>{item.title}</strong>
                <span>{item.details}</span>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}

export default App;
