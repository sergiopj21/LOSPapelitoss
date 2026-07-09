import { useState } from "react";
import Setup from "./components/Setup";
import Submission from "./components/Submission";
import GameRunner from "./components/GameRunner";
import FinalResults from "./components/FinalResults";
import { DEFAULT_CATEGORIES } from "./lib/game";
import "./App.css";

const PHASES = {
  SETUP: "setup",
  SUBMISSION: "submission",
  PLAYING: "playing",
  FINISHED: "finished",
};

export default function App() {
  const [phase, setPhase] = useState(PHASES.SETUP);
  const [teams, setTeams] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [papers, setPapers] = useState([]);
  const [finalTeams, setFinalTeams] = useState([]);

  function handleSubmissionDone(collectedPapers) {
    setPapers(collectedPapers);
    setPhase(PHASES.PLAYING);
  }

  function handleFinish(teamsAtEnd) {
    setFinalTeams(teamsAtEnd);
    setPhase(PHASES.FINISHED);
  }

  function replaySameTeams() {
    setTeams(finalTeams.map((t) => ({ ...t, score: 0, playerPointer: 0 })));
    setPhase(PHASES.SETUP);
  }

  function newGame() {
    setTeams([]);
    setCategories(DEFAULT_CATEGORIES);
    setPapers([]);
    setFinalTeams([]);
    setPhase(PHASES.SETUP);
  }

  return (
    <div className="app-shell">
      {phase === PHASES.SETUP && (
        <Setup
          teams={teams}
          setTeams={setTeams}
          categories={categories}
          setCategories={setCategories}
          onContinue={() => setPhase(PHASES.SUBMISSION)}
        />
      )}

      {phase === PHASES.SUBMISSION && (
        <Submission teams={teams} categories={categories} onDone={handleSubmissionDone} />
      )}

      {phase === PHASES.PLAYING && (
        <GameRunner initialTeams={teams} papers={papers} onFinish={handleFinish} />
      )}

      {phase === PHASES.FINISHED && (
        <FinalResults teams={finalTeams} onReplaySameTeams={replaySameTeams} onNewGame={newGame} />
      )}
    </div>
  );
}
