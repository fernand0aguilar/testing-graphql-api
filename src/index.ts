import app from "./server";

import { PORT } from "./config/constants";

app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
});