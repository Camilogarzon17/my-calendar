import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import { TodoCounter } from "./TodoCounter";
import { TodoSearch } from "./TodoSearch";
import { TodoList } from "./TodoList";
import { AddTodoButton } from "./AddTodoButton";
import "./App.css";
import computer from "./computer.svg";

const clientId =
  "159936141692-qe3iqv259ldmf69pmv3cd52191g05ui8.apps.googleusercontent.com";

function App() {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("month");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          clientId: clientId,
          scope: "https://www.googleapis.com/auth/calendar",
        })
        .then(() => {
          gapi.auth2
            .getAuthInstance()
            .signIn()
            .then(() => {
              loadCalendarEvents();
            });
        });
    }

    gapi.load("client:auth2", start);
  }, []);

  const loadCalendarEvents = () => {
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7); // 7 días después

    gapi.client.load("calendar", "v3", () => {
      gapi.client.calendar.events
        .list({
          calendarId: "primary",
          timeMin: now.toISOString(), // A partir de la fecha actual
          timeMax: sevenDaysLater.toISOString(), // Hasta 7 días después
          showDeleted: false,
          singleEvents: true,
          orderBy: "startTime",
        })
        .then((response) => {
          const events = response.result.items.map((event) => ({
            ...event,
            completed: JSON.parse(localStorage.getItem(event.id)) || false,
          }));
          setEvents(events);
        })
        .catch((error) => {
          console.error("Error al cargar eventos: ", error);
        });
    });
  };

  const addEvent = (title, dateTime) => {
    const event = {
      summary: title,
      start: {
        dateTime: dateTime,
        timeZone: "America/Bogota",
      },
      end: {
        dateTime: new Date(
          new Date(dateTime).getTime() + 3600000
        ).toISOString(),
        timeZone: "America/Bogota",
      },
    };

    gapi.client.calendar.events
      .insert({
        calendarId: "primary",
        resource: event,
      })
      .then((response) => {
        loadCalendarEvents();
      });
  };

  const completeEvent = (eventToComplete) => {
    const updatedEvent = {
      ...eventToComplete,
      completed: !eventToComplete.completed,
    };
    setEvents(
      events.map((event) =>
        event.id === eventToComplete.id ? updatedEvent : event
      )
    );

    // Actualizar el estado en localStorage
    localStorage.setItem(
      eventToComplete.id,
      JSON.stringify(updatedEvent.completed)
    );

    // Actualizar la tarea en Google Calendar si es necesario
    if (!eventToComplete.completed) {
      gapi.client.calendar.events
        .patch({
          calendarId: "primary",
          eventId: eventToComplete.id,
          resource: {
            status: "completed",
            // Add any other required fields if needed (check API documentation)
          },
        })
        .then(() => {
          console.log("Evento actualizado como completado en Google Calendar");
        })
        .catch((error) => {
          console.error(
            "Error al actualizar evento en Google Calendar:",
            error.body
          );
        });
    }
  };

  const deleteEvent = (eventToDelete) => {
    gapi.client.calendar.events
      .delete({
        calendarId: "primary",
        eventId: eventToDelete.id,
      })
      .then(() => {
        localStorage.removeItem(eventToDelete.id); // Eliminar el estado en localStorage
        setEvents(events.filter((event) => event.id !== eventToDelete.id));
      })
      .catch((error) => {
        console.error("Error al eliminar evento: ", error);
      });
  };

  return (
    <section className="container">
      <div className="App">
        <div className="heading">
          <img src={computer} className="heading__img" />
          <h1 className="heading__title">GOOGLE CALENDAR</h1>
        </div>
        <TodoCounter
          completed={events.filter((event) => event.completed).length}
          total={events.length}
        />
        <TodoSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <TodoList
          events={events}
          onComplete={completeEvent}
          onDelete={deleteEvent}
          view={view}
          searchTerm={searchTerm}
        />
        <AddTodoButton onAdd={addEvent} />
      </div>
    </section>
  );
}

export default App;
