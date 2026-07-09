import { useState } from "react";
import { TEAM_COLORS, DEFAULT_CATEGORIES, nextId } from "../lib/game";

export default function Setup({ teams, setTeams, categories, setCategories, onContinue }) {
  const [teamNameDraft, setTeamNameDraft] = useState("");
  const [playerDrafts, setPlayerDrafts] = useState({});

  function addTeam() {
    const name = teamNameDraft.trim();
    if (!name) return;
    const color = TEAM_COLORS[teams.length % TEAM_COLORS.length];
    setTeams([...teams, { id: nextId("team"), name, color: color.hex, players: [], score: 0, playerPointer: 0 }]);
    setTeamNameDraft("");
  }

  function removeTeam(teamId) {
    setTeams(teams.filter((t) => t.id !== teamId));
  }

  function addPlayer(teamId) {
    const draft = (playerDrafts[teamId] || "").trim();
    if (!draft) return;
    setTeams(
      teams.map((t) =>
        t.id === teamId ? { ...t, players: [...t.players, draft] } : t
      )
    );
    setPlayerDrafts({ ...playerDrafts, [teamId]: "" });
  }

  function removePlayer(teamId, index) {
    setTeams(
      teams.map((t) =>
        t.id === teamId
          ? { ...t, players: t.players.filter((_, i) => i !== index) }
          : t
      )
    );
  }

  function updateCategory(index, value) {
    const next = [...categories];
    next[index] = value;
    setCategories(next);
  }

  function addCategory() {
    if (categories.length >= 8) return;
    setCategories([...categories, ""]);
  }

  function removeCategory(index) {
    if (categories.length <= 3) return;
    setCategories(categories.filter((_, i) => i !== index));
  }

  function resetCategories() {
    setCategories(DEFAULT_CATEGORIES);
  }

  const filledCategories = categories.filter((c) => c.trim()).length;
  const teamsReady = teams.length >= 2 && teams.every((t) => t.players.length >= 1);
  const canContinue = teamsReady && filledCategories >= 3;

  return (
    <div className="screen setup-screen">
      <header className="setup-hero">
        <p className="eyebrow">Papelito a papelito</p>
        <h1 className="hand-title">Los Papelitos</h1>
        <p className="setup-sub">
          Forma los equipos, apunta a los jugadores y define las categorias.
          Luego cada uno escribira sus palabras en secreto.
        </p>
      </header>

      <section className="setup-block">
        <h2 className="block-title">1. Equipos y jugadores</h2>
        <div className="add-row">
          <input
            className="text-input"
            placeholder="Nombre del equipo"
            value={teamNameDraft}
            onChange={(e) => setTeamNameDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTeam()}
            maxLength={24}
          />
          <button className="btn btn-ink" onClick={addTeam}>
            Anadir equipo
          </button>
        </div>

        <div className="team-grid">
          {teams.map((team) => (
            <div className="team-card" key={team.id} style={{ "--team-color": team.color }}>
              <div className="team-card-head">
                <span className="team-dot" />
                <h3>{team.name}</h3>
                <button className="icon-btn" onClick={() => removeTeam(team.id)} aria-label={`Quitar equipo ${team.name}`}>
                  ✕
                </button>
              </div>

              <ul className="player-list">
                {team.players.map((player, i) => (
                  <li key={i}>
                    <span>{player}</span>
                    <button className="icon-btn ghost" onClick={() => removePlayer(team.id, i)} aria-label={`Quitar a ${player}`}>
                      ✕
                    </button>
                  </li>
                ))}
                {team.players.length === 0 && (
                  <li className="empty-hint">Sin jugadores todavia</li>
                )}
              </ul>

              <div className="add-row small">
                <input
                  className="text-input"
                  placeholder="Nombre del jugador"
                  value={playerDrafts[team.id] || ""}
                  onChange={(e) => setPlayerDrafts({ ...playerDrafts, [team.id]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && addPlayer(team.id)}
                  maxLength={20}
                />
                <button className="btn btn-outline" onClick={() => addPlayer(team.id)}>
                  Anadir
                </button>
              </div>
            </div>
          ))}
        </div>
        {teams.length < 2 && (
          <p className="hint">Necesitas al menos 2 equipos para empezar.</p>
        )}
      </section>

      <section className="setup-block">
        <div className="block-title-row">
          <h2 className="block-title">2. Categorias</h2>
          <button className="link-btn" onClick={resetCategories}>Restablecer</button>
        </div>
        <p className="hint">Cada jugador escribira una palabra por categoria.</p>
        <div className="category-list">
          {categories.map((cat, i) => (
            <div className="category-row" key={i}>
              <span className="category-index">{i + 1}</span>
              <input
                className="text-input"
                value={cat}
                placeholder={`Categoria ${i + 1}`}
                onChange={(e) => updateCategory(i, e.target.value)}
                maxLength={30}
              />
              {categories.length > 3 && (
                <button className="icon-btn ghost" onClick={() => removeCategory(i)} aria-label="Quitar categoria">
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        {categories.length < 8 && (
          <button className="btn btn-outline small-btn" onClick={addCategory}>
            + Anadir categoria
          </button>
        )}
      </section>

      <footer className="setup-footer">
        <button className="btn btn-primary big-btn" disabled={!canContinue} onClick={onContinue}>
          Empezar a escribir papelitos →
        </button>
        {!canContinue && (
          <p className="hint">
            {teams.length < 2
              ? "Anade al menos 2 equipos."
              : !teamsReady
              ? "Cada equipo necesita al menos 1 jugador."
              : "Rellena al menos 3 categorias."}
          </p>
        )}
      </footer>
    </div>
  );
}
