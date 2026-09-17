import { useState, useEffect } from "react";
import "./App.css";

const habits = [
  { id: "biblia", icon: "🙏", name: "Biblia + oración", min: "10 min" },
  { id: "leer", icon: "📖", name: "Leer libro", min: "15 min" },
  { id: "movilidad", icon: "🧘", name: "Movilidad", min: "10 min" },
  { id: "abdomen", icon: "🔥", name: "Abdomen", min: "10 min" },
  { id: "caminar", icon: "🚶", name: "Caminar", min: "20 min" },
  { id: "beisbol", icon: "⚾", name: "Entrenar béisbol", min: "60 min" },
  { id: "gym", icon: "🏋️", name: "Gym", min: "60–90 min" },
  { id: "agua", icon: "💧", name: "Agua", min: "3 L" },
  { id: "noche", icon: "🌙", name: "Rutina nocturna", min: "20 min" },
];

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function App() {
  const todayKey = getTodayKey();

  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem(`habits-${todayKey}`);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(`habits-${todayKey}`, JSON.stringify(completed));
  }, [completed, todayKey]);

  const toggleHabit = (id) => {
    setCompleted((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = habits.filter(
    (habit) => completed[habit.id]
  ).length;

  const progress = Math.round(
    (completedCount / habits.length) * 100
  );

  const date = new Date();

  const formattedDate = date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <main className="app">
      <section className="header">
        <div>
          <p className="eyebrow">MI TABLERO</p>
          <h1>Hoy toca darle. 🔥</h1>
          <p className="date">{formattedDate}</p>
        </div>

        <div className="streak">
          <span>🔥</span>
          <strong>1</strong>
          <small>racha</small>
        </div>
      </section>

      <section className="progress-card">
        <div className="progress-info">
          <div>
            <span>Progreso de hoy</span>
            <strong>
              {completedCount}/{habits.length}
            </strong>
          </div>

          <span className="percentage">{progress}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      <section className="habits">
        {habits.map((habit) => (
          <button
            key={habit.id}
            className={`habit ${
              completed[habit.id] ? "completed" : ""
            }`}
            onClick={() => toggleHabit(habit.id)}
          >
            <div className="habit-icon">{habit.icon}</div>

            <div className="habit-info">
              <strong>{habit.name}</strong>
              <span>{habit.min}</span>
            </div>

            <div className="check">
              {completed[habit.id] ? "✓" : ""}
            </div>
          </button>
        ))}
      </section>

      {progress === 100 && (
        <section className="finished">
          <span>🏆</span>
          <div>
            <strong>DÍA COMPLETADO</strong>
            <p>Así se empieza a construir el hábito.</p>
          </div>
        </section>
      )}

      <footer>
        <p>Un día a la vez. No buscamos perfección, buscamos constancia.</p>
      </footer>
    </main>
  );
}

export default App;