import express from 'express'
import designRoutes from './design.js'

import developpementRoutes from './developpement.js'

const router = express.Router()

router.use('/courses/design', designRoutes)
router.use('/courses/developpement', developpementRoutes)

export default router
