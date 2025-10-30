import 'dotenv/config';
import app from "./index";

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
