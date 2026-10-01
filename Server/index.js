import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./config/db.config.js";

const PORT = process.env.PORT;
if (!PORT) throw new Error(`Please provide the PORT...`);

connectDB()
  .then(() => {
    app.get("/", (req, res) =>
      res.json({
        statusCode: 200,
        message: "Welcome to the JGEC internship management server",
        success: true,
      }),
    );

    app.listen(PORT, () =>
      console.log(`Server is running on the PORT :: ${PORT}`),
    );
  })
  .catch((err) => console.log(`Err!!! While starting the Server... ${err}`));
