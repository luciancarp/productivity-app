import express from 'express'

export const testServer = () => {
  const app = express()

  // Init Middleware
  app.use(express.json())

  // Define Routes
  app.use('/api/user', require('../../routes/api/user'))
  app.use('/api/project', require('../../routes/api/project'))

  return app
}
