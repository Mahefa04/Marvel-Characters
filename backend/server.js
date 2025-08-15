const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;


const readJSON = () => JSON.parse(fs.readFileSync("characters.json", "utf8"));

const writeJSON = (data) => fs.writeFileSync("characters.json", JSON.stringify(data, null, 2));

app.get("/characters", (req, res) => {
  const data = readJSON();
  res.json(data.characters);
});

app.post("/characters", (req, res) => {
  const data = readJSON();

  const exists = data.characters.some(
    c => c.name === req.body.name && c.realName === req.body.realName
  );
  if (exists) return res.status(400).json({ message: "Character already exists" });

  const newId = data.characters.length > 0 ? Math.max(...data.characters.map(c => c.id)) + 1 : 1;

  const newChar = { id: newId, ...req.body };
  data.characters.push(newChar);
  writeJSON(data);

  res.json(newChar);
});

app.put("/characters/:id", (req, res) => {
  const data = readJSON();
  const index = data.characters.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Character not found" });

  const exists = data.characters.some(
    (c, i) => i !== index && c.name === req.body.name && c.realName === req.body.realName
  );
  if (exists) return res.status(400).json({ message: "Character already exists" });

  data.characters[index] = { id: data.characters[index].id, ...req.body };
  writeJSON(data);
  res.json(data.characters[index]);
});

app.delete("/characters/:id", (req, res) => {
  const data = readJSON();
  const index = data.characters.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Character not found" });

  const deleted = data.characters.splice(index, 1);
  writeJSON(data);
  res.json(deleted[0]);
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
