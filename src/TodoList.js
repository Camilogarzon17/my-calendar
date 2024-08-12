import React from "react";
import { TodoItem } from "./TodoItem";

function TodoList({ events, onComplete, onDelete, searchTerm }) {
  // Filtra eventos para mostrar solo la primera instancia
  const uniqueEvents = events.reduce((unique, event) => {
    if (!event.recurrence || !event.recurrence.length) {
      unique.push(event);
    } else {
      const isDuplicate = unique.some(
        (e) =>
          e.summary === event.summary &&
          e.start.dateTime === event.start.dateTime
      );
      if (!isDuplicate) {
        unique.push(event);
      }
    }
    return unique;
  }, []);

  // Filtrar eventos por término de búsqueda
  const filteredEvents = uniqueEvents.filter((event) =>
    event.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ul>
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
          <TodoItem
            key={event.id}
            event={event}
            onComplete={onComplete}
            onDelete={onDelete}
          />
        ))
      ) : (
        <li className="todo-item">
        <p className="todo-title" >No se encontraron resultados para su búsqueda. intente de nuevo</p>
        </li>
      )}
    </ul>
  );
}

export { TodoList };
