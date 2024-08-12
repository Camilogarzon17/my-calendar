import React, { useEffect, useState } from "react";
import "./TodoItem.css";
import check from "./casilla-de-verificacion-marcada.png";
import cancel from "./cancelar.png";

function TodoItem({ event, onComplete, onDelete }) {
  const [isCompleted, setIsCompleted] = useState(event.completed);

  const eventStart = new Date(event.start.dateTime || event.start.date);
  const eventDate = eventStart.toLocaleDateString();
  const eventTime = eventStart.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Obtener la fecha y hora actuales
  const now = new Date();
  const isToday = eventDate === now.toLocaleDateString();
  const isPast = eventStart < now;

  useEffect(() => {
    if (isPast && !isCompleted) {
      setIsCompleted(true);
      onComplete(event); // Llamar a onComplete para actualizar el estado global
    }
  }, [isPast, isCompleted, onComplete, event]);

  return (
    <li className={`todo-item ${isCompleted ? "completed" : ""}`}>
      <span
        className={`complete ${isCompleted ? "disabled" : ""}`}
        onClick={() => !isCompleted && !isPast && onComplete(event)}
      >
        <img src={check} alt="Confirmar" />
      </span>
      <p className="todo-title">{event.summary}</p>
      <p className="todo-date">
        {isToday ? (
          <>
            {eventDate}
            <br />
            {eventTime}
          </>
        ) : (
          eventDate
        )}
      </p>
      <span className="delete" onClick={() => onDelete(event)}>
        <img src={cancel} alt="Eliminar" />
      </span>
    </li>
  );
}

export { TodoItem };
