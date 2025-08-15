import React, { useEffect, useState } from "react";

function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [form, setForm] = useState({ name: "", realName: "", universe: "" });
  const [deleteId, setDeleteId] = useState("");
  const [editId, setEditId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCharacters = () => {
    fetch("http://localhost:5000/characters")
      .then(res => res.json())
      .then(data => setCharacters(data))
      .catch(err => setErrorMessage(err.message));

  };

  useEffect(() => { fetchCharacters(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setErrorMessage("");

    const url = editId ? `http://localhost:5000/characters/${editId}` : "http://localhost:5000/characters";
    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) return res.json().then(data => { throw new Error(data.message); });
        return res.json();
      })
      .then(() => {
        fetchCharacters();
        setForm({ name: "", realName: "", universe: "" });
        setEditId(null);
      })
      .catch(err => setErrorMessage(err.message));
  };

  const handleEdit = char => {
    setForm({ name: char.name, realName: char.realName, universe: char.universe });
    setEditId(char.id);
    setErrorMessage("");
  };

  const handleCancel = () => {
    setForm({ name: "", realName: "", universe: "" });
    setEditId(null);
    setErrorMessage("");
  };

  const handleDelete = () => {
    setErrorMessage("");
    if (!deleteId) return setErrorMessage("Entrez l'ID du personnage à supprimer");

    fetch(`http://localhost:5000/characters/${deleteId}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) return res.json().then(data => { throw new Error(data.message); });
        return res.json();
      })
      .then(() => {
        fetchCharacters();
        setDeleteId("");
      })
      .catch(err => setErrorMessage(err.message));
  };

  return (
    <>
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Real Name</th><th>Universe</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {characters.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.realName}</td>
              <td>{c.universe}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(c)}>✏️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleSubmit} className="form-container">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="realName" placeholder="Real Name" value={form.realName} onChange={handleChange} required />
        <input name="universe" placeholder="Universe" value={form.universe} onChange={handleChange} required />
        <button type="submit">{editId ? "Update" : "Add"}</button>
        {editId && <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>}
      </form>

      <div className="delete-container">
        <input placeholder="ID to delete" value={deleteId} onChange={e => setDeleteId(e.target.value)} />
        <button onClick={handleDelete}>Delete</button>
      </div>
    </>
  );
}

export default CharacterList;
