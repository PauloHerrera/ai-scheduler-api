import express from 'express';
import * as doctorHandler from '../handlers/doctorHandler';

const router = express.Router();

router.post('/', doctorHandler.createDoctor);

router.get('/', doctorHandler.getDoctors);

router.get('/:id', doctorHandler.getDoctorById);

router.put('/:id', doctorHandler.updateDoctor);

router.delete('/:id', doctorHandler.deleteDoctor);

export default router;
