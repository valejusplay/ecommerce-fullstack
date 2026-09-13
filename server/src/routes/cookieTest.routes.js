import { Router } from 'express'

import {
  leerCookie,
  setearCookie,
} from '../controllers/cookieTest.controller.js'

const router = Router()

router.post('/set', setearCookie)
router.get('/read', leerCookie)

export default router
