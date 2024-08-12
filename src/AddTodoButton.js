import React, { useState } from "react";
import Modal from "react-modal";
import "./AddTodoButton.css";

Modal.setAppElement("#root");

function AddTodoButton({ onAdd }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && date && time) {
      const dateTime = new Date(`${date}T${time}`).toISOString();
      onAdd(title, dateTime);
      setTitle("");
      setDate("");
      setTime("");
      setModalIsOpen(false);
    }
  };

  return (
    <>
      <div className="add-task-container">
        <button
          className="add-task-button"
          onClick={() => setModalIsOpen(true)}
        >
          <svg
            className="add-task-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Agregar tarea al calendario
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="custom-modal"
        overlayClassName="custom-modal-overlay"
      >
        <h2>Agregar al calendario</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Titulo:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Fecha:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Hora:</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit">
              <svg
                className="add-task-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Agregar
            </button>
            <button type="button" onClick={() => setModalIsOpen(false)}>
              <svg
                className="cancel-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export { AddTodoButton };
