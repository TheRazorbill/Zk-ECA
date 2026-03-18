import { useMemo, useState } from "react";
import {
  createAgeProofPayload,
  createIssuerChallenge,
  verifyAgeProof,
} from "@repo/crypto-core";
import "./App.css";

function App() {
  const [minimumAge, setMinimumAge] = useState(18);
  const [birthYear, setBirthYear] = useState(2000);
  const [challenge, setChallenge] = useState(createIssuerChallenge());

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

  return (
    <main className="app-shell">
      <section className="discord-card">
        <p className="badge">Verifier Demo</p>
        <h1>Discord quer confirmar sua idade</h1>
        <p className="subtitle">
          Simulacao de solicitacao de prova ZK para liberar acesso a um canal
          restrito.
        </p>

        <div className="controls">
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

        <div className="challenge-row">
          <p>
            <strong>Challenge:</strong> {challenge}
          </p>
          <button type="button" onClick={() => setChallenge(createIssuerChallenge())}>
            Gerar nova challenge
          </button>
        </div>

        <div className="proof-box">
          <h2>Prova enviada pelo mobile-wallet</h2>
          <pre>{proof}</pre>
        </div>

        <div className={`result ${result.valid ? "approved" : "rejected"}`}>
          <h2>{result.valid && result.isOverMinimumAge ? "Aprovado" : "Negado"}</h2>
          <p>
            valid={String(result.valid)} | overMinimumAge={String(result.isOverMinimumAge)}
          </p>
          {result.reason ? <p>motivo: {result.reason}</p> : null}
        </div>
      </section>
    </main>
  );
}

export default App;
