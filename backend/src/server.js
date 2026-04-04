const dotenv = require('dotenv')
const app = require('./app')

dotenv.config()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  // Minimal startup log for local development visibility.
  console.log(`Backend server running on http://localhost:${PORT}`)
})
