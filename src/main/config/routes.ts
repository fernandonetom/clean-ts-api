import { Express, Router } from 'express'
import fg from 'fast-glob'
export default (app: Express): void => {
  const route = Router()
  app.use('/api', route)
  fg.sync('**/src/main/routes/**.routes.ts')
    .map(async file => {
      (await import(`../../../${file}`))
        .default(route)
    })
}
