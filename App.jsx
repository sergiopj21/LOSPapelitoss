import { useEffect, useRef, useState } from "react";
import { ROUNDS, TURN_SECONDS, shuffle } from "../lib/game";

function currentPlayerOf(team) {
  if (team.players.length === 0) return "";
  return team.players[team.playerPointer % team.players.length];
}

export default function GameRunner({ initialTeams, papers, onFinish }) {
  const [teams, setTeams] = useState(initialTeams);
  const [roundIndex, setRoundIndex] = useState(0);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [subPhase, setSubPhase] = useState("round-intro");
  const [deck, setDeck] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TURN_SECONDS);
  const [timerRunning, setTimerRunning] = useState(false);
  const [turnGottenWords, setTurnGottenWords] = useState([]);
  const [deckEmptiedThisTurn, setDeckEmptiedThisTurn] = useState(false);
  const tickRef = useRef(null);

  const round = ROUNDS[roundIndex];
  const currentTeam = teams[currentTeamIndex];
  const currentPlayer = currentPlayerOf(currentTeam);

  useEffect(() => {
    if (!timerRunning) return undefined;
    tickRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(tickRef.current);
          setTimerRunning(false);
          setSubPhase("turn-summary");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, [timerRunning]);

  function startRound() {
    setDeck(shuffle(papers));
    setSubPhase("turn-ready");
  }

  function startTurn() {
    setTimeLeft(TURN_SECONDS);
    setTurnGottenWords([]);
    setDeckEmptiedThisTurn(false);
    setTimerRunning(true);
    setSubPhase("turn-active");
  }

  function markCorrect() {
    if (deck.length === 0) return;
    const [word, ...rest] = deck;
    setTurnGottenWords((w) => [...w, word]);
    setTeams((ts) =>
      ts.map((t, i) => (i === currentTeamIndex ? { ...t, score: t.score + 1 } : t))
    );
    setDeck(rest);
    if (rest.length === 0) {
      clearInterval(tickRef.current);
      setTimerRunning(false);
      setDeckEmptiedThisTurn(true);
      setSubPhase("turn-summary");
    }
  }

  function skipWord() {
    if (deck.length <= 1) return;
    const [word, ...rest] = deck;
    setDeck([...rest, word]);
  }

  function advanceTurnPointer() {
    setTeams((ts) =>
      ts.map((t, i) => (i === currentTeamIndex ? { ...t, playerPointer: t.playerPointer + 1 } : t))
    );
    setCurrentTeamIndex((i) => (i + 1) % teams.length);
  }

  function handleAfterTurnSummary() {
    advanceTurnPointer();
    if (deckEmptiedThisTurn) {
      if (roundIndex === ROUNDS.length - 1) {
        onFinish(teams);
      } else {
        setSubPhase("round-summary");
      }
    } else {
      setSubPhase("turn-ready");
    }
  }

  function handleNextRound() {
    setRoundIndex((r) => r + 1);
    setSubPhase("round-intro");
  }

  const nextTeamIndex = (currentTeamIndex + 1) % teams.length;
  const nextPreview = teams[nextTeamIndex];

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="screen game-screen">
      <div className="round-tracker">
        {ROUNDS.map((r, i) => (
          <span
            key={r.key}
            className={
              "round-pip" +
              (i === roundIndex ? " active" : "") +
              (i < roundIndex ? " done" : "")
            }
          >
            {r.emoji}
          </span>
        ))}
      </div>

      {subPhase === "round-intro" && (
        <div className="round-intro">
          <p className="eyebrow">Ronda {roundIndex + 1} de {ROUNDS.length}</p>
          <h1 className="hand-title huge">{round.emoji} {round.name}</h1>
          <p className="round-instruction">{round.instruction}</p>
          <button className="btn btn-primary big-btn" onClick={startRound}>
            Comenzar ronda →
          </button>
        </div>
      )}

      {subPhase === "turn-ready" && (
        <div className="turn-ready" style={{ "--team-color": currentTeam.color }}>
          <p className="eyebrow">{round.name} · Turno de</p>
          <h1 className="hand-title huge">{currentTeam.name}</h1>
          <p className="turn-player">🙋 {currentPlayer}</p>
          <p className="hint">Papelitos restantes en esta ronda: {deck.length}</p>
          <button className="btn btn-primary big-btn" onClick={startTurn}>
            Empezar turno ({TURN_SECONDS}s) →
          </button>
        </div>
      )}

      {subPhase === "turn-active" && (
        <div className="turn-active" style={{ "--team-color": currentTeam.color }}>
          <div className={"timer" + (timeLeft <= 5 ? " urgent" : "")}>{timeLeft}s</div>
          <p className="turn-caption">{currentTeam.name} · {currentPlayer}</p>
          <div className="paper-card">
            <span className="paper-tape" />
            <p className="paper-category">{deck[0]?.category}</p>
            <p className="paper-word">{deck[0]?.word}</p>
          </div>
          <div className="turn-actions">
            <button className="btn btn-outline skip-btn" onClick={skipWord} disabled={deck.length <= 1}>
              Pasar
            </button>
            <button className="btn btn-good" onClick={markCorrect}>
              ¡Acertado! ✓
            </button>
          </div>
          <p className="hint">Aciertos este turno: {turnGottenWords.length}</p>
        </div>
      )}

      {subPhase === "turn-summary" && (
        <div className="turn-summary" style={{ "--team-color": currentTeam.color }}>
          <p className="eyebrow">Turno terminado</p>
          <h2 className="hand-title big">
            {currentTeam.name} consiguio {turnGottenWords.length}
          </h2>
          {turnGottenWords.length > 0 ? (
            <ul className="gotten-list">
              {turnGottenWords.map((w) => (
                <li key={w.id}>{w.word}</li>
              ))}
            </ul>
          ) : (
            <p className="hint">Ningun papelito acertado en este turno.</p>
          )}
          {deckEmptiedThisTurn ? (
            <button className="btn btn-primary big-btn" onClick={handleAfterTurnSummary}>
              Se acabaron los papelitos, ver resumen de la ronda →
            </button>
          ) : (
            <button className="btn btn-primary big-btn" onClick={handleAfterTurnSummary}>
              Turno de {nextPreview.name} ({currentPlayerOf(nextPreview)}) →
            </button>
          )}
        </div>
      )}

      {subPhase === "round-summary" && (
        <div className="round-summary">
          <p className="eyebrow">Ronda {roundIndex + 1} completada</p>
          <h2 className="hand-title big">{round.emoji} {round.name} terminada</h2>
          <ol className="scoreboard">
            {sortedTeams.map((t) => (
              <li key={t.id} style={{ "--team-color": t.color }}>
                <span className="score-dot" />
                <span className="score-name">{t.name}</span>
                <span className="score-value">{t.score}</span>
              </li>
            ))}
          </ol>
          <button className="btn btn-primary big-btn" onClick={handleNextRound}>
            Ronda {roundIndex + 2}: {ROUNDS[roundIndex + 1].emoji} {ROUNDS[roundIndex + 1].name} →
          </button>
        </div>
      )}
    </div>
  );
}
