import express from 'express'
require('dotenv').config()

export const createServer = (port: string) => {
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

  let server = app.listen(port, () => {
    console.log(`Server started on port ${port}`)
  })

  return server
}
