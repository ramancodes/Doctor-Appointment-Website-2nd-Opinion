import express from 'express'
import { doctorsList, loginDoctor } from '../controllers/doctorController.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorsList)
doctorRouter.post('/login', loginDoctor)

export default doctorRouter