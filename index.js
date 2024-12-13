const app = require("./server");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
