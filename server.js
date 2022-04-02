const { app } = require('./app');

//Utils
const { db } = require('./utils/database');
const { initModels } = require('./utils/initModels');

//Database authenticated
db
  .authenticate()
  .then(() => console.log('Database authenticated'))
  .catch((err) => console.log(err));

//Init realtions
initModels();

//Database synced with models realtions
db
  .sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.log(err));

//Run server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Express app running on port: ${PORT}`);
});
