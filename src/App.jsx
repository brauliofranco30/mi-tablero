import { useEffect, useState } from "react";
import "./App.css";

const activities = [
  {
    id: 1,
    title: "Biblia + oración",
    icon: "🙏",
    time: "07:00",
    duration: 10,
  },
  {
    id: 2,
    title: "Leer libro",
    icon: "📖",
    time: "07:20",
    duration: 15,
  },
  {
    id: 3,
    title: "Movilidad",
    icon: "🧘",
    time: "07:40",
    duration: 10,
  },
  {
    id: 4,
    title: "Abdomen",
    icon: "🔥",
    time: "08:00",
    duration: 10,
  },
  {
    id: 5,
    title: "Caminar",
    icon: "🚶",
    time: "08:15",
    duration: 20,
  },
  {
    id: 6,
    title: "Béisbol",
    icon: "⚾",
    time: "18:00",
    duration: 60,
  },
  {
    id: 7,
    title: "Gym",
    icon: "🏋️",
    time: "20:30",
    duration: 90,
  },
  {
    id: 8,
    title: "Rutina nocturna",
    icon: "🌙",
    time: "22:30",
    duration: 20,
  },
  {
  id: 9,
  title: "Actividad extra",
  icon: "➕",
  time: "",
  duration: "",
  extra: true,
},
];

const bibleVerses = [
  "Todo lo puedo en Cristo que me fortalece. — Filipenses 4:13",
  "Confía en el Señor con todo tu corazón. — Proverbios 3:5",
  "No nos cansemos de hacer el bien. — Gálatas 6:9",
  "Esfuérzate y sé valiente; no temas ni desmayes. — Josué 1:9",
  "El Señor es mi pastor; nada me faltará. — Salmos 23:1",
  "Encomienda al Señor tus obras, y tus pensamientos serán afirmados. — Proverbios 16:3",
  "Todo lo que hagan, háganlo de corazón. — Colosenses 3:23",
];

const motivationalQuotes = [
  "No necesitas ganas todos los días. Necesitas disciplina.",
  "Un día a la vez. Sigue avanzando.",
  "Disciplina hoy. Resultados mañana.",
  "Hazlo aunque no tengas ganas.",
  "Pequeños hábitos. Grandes cambios.",
  "No te detengas por un mal día.",
  "Lo que haces todos los días construye quién eres.",
  "Empieza. Hazlo. Termínalo.",
];

function App() {
  console.log("localStorage:", localStorage.getItem("miTableroCompleted"));

const allMotivation = [...bibleVerses, ...motivationalQuotes];

const today = new Date();

const todayKey =
  today.getFullYear() +
  "-" +
  String(today.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(today.getDate()).padStart(2, "0");
const [currentDateKey, setCurrentDateKey] = useState(todayKey);
// Historial de guardado
const [dailyHistory, setDailyHistory] = useState(() => {
  const savedHistory = localStorage.getItem("miTableroHistory");

  if (savedHistory) {
    return JSON.parse(savedHistory);
  }

  return {};
});

// Actividades del día actual
const [completed, setCompleted] = useState(() => {
  const savedHistory = localStorage.getItem("miTableroHistory");

  if (!savedHistory) {
    return {};
  }

  const history = JSON.parse(savedHistory);

  return history[todayKey]?.completed || {};
});

const [selectedActivity, setSelectedActivity] = useState(null);
const [selectedHistoryDate, setSelectedHistoryDate] = useState(null);

const [activityDetails, setActivityDetails] = useState(() => {
  const savedHistory = localStorage.getItem("miTableroHistory");

  if (!savedHistory) {
    return {};
  }

  const history = JSON.parse(savedHistory);

  return history[todayKey]?.activityDetails || {};
});

const [startTime, setStartTime] = useState("");

const [activityDuration, setActivityDuration] = useState("");

const [extraActivityName, setExtraActivityName] = useState("");


/* Guardados viejos
useEffect(() => {
  localStorage.setItem(
    "miTableroCompleted",
    JSON.stringify(completed)
  );

  
}, [completed]);

useEffect(() => {
  localStorage.setItem(
    "miTableroActivityDetails",
    JSON.stringify(activityDetails)
  );
}, [activityDetails]);
*/
//Guardar actividades en el día actual//
useEffect(() => {
  setDailyHistory((prev) => {
    const updatedHistory = {
      ...prev,
      [todayKey]: {
        completed,
        activityDetails,
      },
    };

    localStorage.setItem(
      "miTableroHistory",
      JSON.stringify(updatedHistory)
    );

    return updatedHistory;
  });
}, [completed, activityDetails]);
useEffect(() => {
  const checkNewDay = () => {
    const newDate = new Date();

    const newDateKey =
      newDate.getFullYear() +
      "-" +
      String(newDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(newDate.getDate()).padStart(2, "0");

    if (newDateKey !== currentDateKey) {
      const savedHistory = localStorage.getItem("miTableroHistory");

      const history = savedHistory
        ? JSON.parse(savedHistory)
        : {};

      const newDay = history[newDateKey];

      setCurrentDateKey(newDateKey);

      setCompleted(newDay?.completed || {});
      setActivityDetails(newDay?.activityDetails || {});

      setSelectedActivity(null);
      setStartTime("");
      setActivityDuration("");
      setExtraActivityName("");
    }
  };

  const interval = setInterval(checkNewDay, 60000);

  return () => clearInterval(interval);
}, [currentDateKey]);

const dateKey =
  today.getFullYear() +
  today.getMonth() +
  today.getDate();

const dailyMessage =
  allMotivation[dateKey % allMotivation.length];

  function toggleActivity(id) {
    setCompleted((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }
 // Nueva funsión formulario //
function openActivityForm(activity) {
  setSelectedActivity(activity);
  setStartTime("");
  setActivityDuration("");
  setExtraActivityName("");
}
//Formulario de actividad de Béisbol guardar y tachar//
function saveActivity() {
  if (!selectedActivity) {
    return;
  }

  setActivityDetails((prev) => ({
  ...prev,
  [selectedActivity.id]: {
    time: startTime,
    duration: activityDuration,
    name: selectedActivity.extra
      ? extraActivityName
      : selectedActivity.title,
  },
}));

  setCompleted((prev) => ({
    ...prev,
    [selectedActivity.id]: true,
  }));

  setSelectedActivity(null);
}
//Funciones de historial//
const getHistoryDays = () => {
  return Object.keys(dailyHistory).sort((a, b) =>
    b.localeCompare(a)
  );
};

const formatHistoryDate = (dateKey) => {
  const [year, month, day] = dateKey.split("-");

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

  const completedCount = activities.filter(function (activity) {
    return completed[activity.id];
  }).length;

  const progress = Math.round(
    (completedCount / activities.length) * 100
  );

  return (
    <main className="app">
      <h1>Un Día a la Vez ❤️</h1>

      <section className="progress-card">
        <div className="progress-info">
          <div>
            <span>Progreso de hoy</span>

            <strong key={completedCount} className="progress-count">
              {completedCount}/{activities.length}
            </strong>
          </div>

          <span key={progress} className="percentage">
          {progress}%
          </span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: progress + "%" }}
          />
        </div>
      </section>

      <section className="habits">
        {activities.map(function (activity) {
          return (
            <button
            key={activity.id}
            className={completed[activity.id] ? "activity completed" : "activity"}
            onClick={() => openActivityForm(activity)}
            >
              <span>{activity.icon}</span>

              <strong>
                {activity.extra && activityDetails[activity.id]?.name
                ? activityDetails[activity.id].name
                : activity.title}
              </strong>

              <span>
  {activityDetails[activity.id]
    ? `${activityDetails[activity.id].time} · ${activityDetails[activity.id].duration} min`
    : `${activity.time} · ${activity.duration} min`}
</span>

                <span className="check">
    {completed[activity.id] ? "✓" : ""}
  </span>
            </button>
          );
        })}
      </section>

{selectedActivity && (
  <section className="activity-form">
   <div className="form-header">
  <span className="form-icon">{selectedActivity.icon}</span>

  <div>
    <span className="form-label">Registrar actividad</span>
    <h2>{selectedActivity.title}</h2>
  </div>
</div>

  {selectedActivity.extra && (
  <label>
    Actividad
    <input
      type="text"
      placeholder="¿Qué hiciste?"
      value={extraActivityName}
      onChange={(e) => setExtraActivityName(e.target.value)}
    />
  </label>
)}

    <label>
      Hora de inicio
      <input
  type="time"
  value={startTime}
  onChange={(e) => setStartTime(e.target.value)}
/>
    </label>

    <label>
      Duración
      <input
  type="number"
  min="1"
  placeholder="Minutos"
  value={activityDuration}
  onChange={(e) => setActivityDuration(e.target.value)}
/>
    </label>

    <div className="form-buttons">
      <button
        type="button"
        onClick={() => setSelectedActivity(null)}
      >
        Cancelar
      </button>

      <button type="button" onClick={saveActivity}>
      Guardar
      </button>
    </div>
  </section>
)}

      {progress === 100 && (
        <section className="finished">
          🏆 ¡Día completado!
        </section>
      )}
      <section className="daily-message">
  <span>✨ Para hoy</span>

  <strong>
    {new Date().toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}
  </strong>

  <p>{dailyMessage}</p>
</section>

<section className="history-section">
  <h2>📅 Historial</h2>

  <div className="history-days">
    {getHistoryDays().map((dateKey) => {
      const dayData = dailyHistory[dateKey] || {};
      const dayCompleted = dayData.completed || {};

      const completedCount = activities.filter(
        (activity) => dayCompleted[activity.id]
      ).length;

      const total = activities.length;
      const percentage = Math.round(
        (completedCount / total) * 100
      );

      return (
        <button
          key={dateKey}
          className={`history-day ${
            selectedHistoryDate === dateKey ? "selected" : ""
          }`}
          onClick={() =>
  setSelectedHistoryDate(
    selectedHistoryDate === dateKey ? null : dateKey
  )
}
        >
          <div>
            <strong>{formatHistoryDate(dateKey)}</strong>

            <span>
              {completedCount}/{total} actividades
            </span>
          </div>

          <span>{percentage}%</span>
        </button>
      );
    })}
  </div>

  {selectedHistoryDate && (
    <div className="history-detail">
      <h3>
        {formatHistoryDate(selectedHistoryDate)}
      </h3>

      <div className="history-results">

        <div>
          <h4>✅ Completadas</h4>

          {activities
            .filter(
              (activity) =>
                dailyHistory[selectedHistoryDate]?.completed?.[
                  activity.id
                ]
            )
            .map((activity) => (
              <div
                className="history-activity"
                key={activity.id}
              >
                {activity.icon} {activity.title}
              </div>
            ))}
        </div>

        <div>
          <h4>⏳ Pendientes</h4>

          {activities
            .filter(
              (activity) =>
                !dailyHistory[selectedHistoryDate]?.completed?.[
                  activity.id
                ]
            )
            .map((activity) => (
              <div
                className="history-activity"
                key={activity.id}
              >
                {activity.icon} {activity.title}
              </div>
            ))}
        </div>

      </div>
    </div>
  )}
</section>

</main>
);
}

export default App;