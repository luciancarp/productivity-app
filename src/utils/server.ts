import express from 'express'
require('dotenv').config()

export const createServer = () => {
  const app = express()

  // Init Middleware
  app.use(express.json())

  app.get('/', (req, res) => {
    res.status(200)
    res.send('ok')
  })

  // Define Routes
  app.use('/api/user', require('../routes/api/user'))
  app.use('/api/project', require('../routes/api/project'))

  const PORT = process.env.PORT || 5000

  let server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
  })

  return server
}
