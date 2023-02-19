import "./App.css";
import { useState, useEffect } from "react";
import {marked} from "marked";

const App = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes"));
    if (storedNotes) {
      setNotes(storedNotes);
    }
  }, []);

  const addNewNote = (text = "") => {
    const newNote = {
      id: Date.now(),
      text,
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const updateNoteText = (id, text) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, text };
        }
        return note;
      })
    );
  };

  const deleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  return (
    <div>
      <button className="add" onClick={() => addNewNote()}>
        <i className="fas fa-plus"></i> Add note
      </button>
      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          updateNoteText={updateNoteText}
          deleteNote={deleteNote}
        />
      ))}
    </div>
  );
}

function Note({ note: { id, text }, updateNoteText, deleteNote }) {
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(text);

  const toggleEditing = () => setIsEditing(!isEditing);

  const handleNoteTextChange = (event) => {
    setNoteText(event.target.value);
    updateNoteText(id, event.target.value);
  };

  return (
    <div className="note">
      <div className="tools">
        <button className="edit" onClick={toggleEditing}>
          <i className="fas fa-edit"></i>
        </button>
        <button className="delete" onClick={() => deleteNote(id)}>
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
      {isEditing ? (
        <textarea value={noteText} onChange={handleNoteTextChange} />
      ) : (
        <div
          className={`main ${text ? "" : "hidden"}`}
          dangerouslySetInnerHTML={{ __html: marked(text) }}
        ></div>
      )}
    </div>
  );
}

export default App;
