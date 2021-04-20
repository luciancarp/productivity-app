import express from 'express'
require('dotenv').config()

export const createServer = async () => {
  const app = express()

  // Init Middleware
  app.use(express.json())

  // Define Routes
  app.use('/api/user', require('../routes/api/user'))
  app.use('/api/project', require('../routes/api/project'))

  const PORT = process.env.PORT || 5000

  let server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
  })

  const stop = () => {
    server.close()
  }

  return { app, stop }
}
