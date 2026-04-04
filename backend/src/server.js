const dotenv = require('dotenv')

dotenv.config()

const { connectDatabase } = require('./config/database')
const app = require('./app')

const PORT = process.env.PORT || 5000

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is required')
  process.exit(1)
}

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect database', err)
    process.exit(1)
  })
