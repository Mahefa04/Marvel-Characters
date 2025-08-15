import React from "react";
import CharacterList from "./components/CharacterList";

function App() {
  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Marvel Characters</h1>
      <CharacterList />
    </div>
  );
}

export default App;
