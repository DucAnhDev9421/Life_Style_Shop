const dotenv = require('dotenv')
const app = require('./app')
const connectDatabase = require('./config/database')

dotenv.config()

const PORT = process.env.PORT || 5000

async function start() {
  try {
    await connectDatabase()
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

start()
