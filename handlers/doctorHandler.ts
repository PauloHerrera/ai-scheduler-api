import type { Request, Response } from 'express';
import * as doctorRepository from '../repositories/doctorRepository';
import { createDoctorSchema, updateDoctorSchema, doctorIdSchema } from '../schemas/doctorSchema'; // Added
import { ZodError } from 'zod'; // Added

export const createDoctor = async (req: Request, res: Response) => {
  try {
    const validationResult = createDoctorSchema.safeParse(req.body); // Changed
    if (!validationResult.success) { // Changed
      return res.status(400).json({ message: 'Validation failed', errors: validationResult.error.format() });
    }

    const doctorData = validationResult.data; // Changed
    const doctor = await doctorRepository.createDoctor(doctorData);
    res.status(201).json(doctor);
  } catch (error) {
    console.error('Error creating doctor:', error);
    if (error instanceof ZodError) { // Should not happen if safeParse is used correctly above
         return res.status(400).json({ message: 'Validation error in catch', errors: error.format() });
    }
    // Assuming error is PrismaError based on previous code
    if (error.code === 'P2002' && error.meta?.target?.includes('registration')) {
        return res.status(409).json({ message: 'Doctor with this registration already exists' });
    }
    res.status(500).json({ message: 'Error creating doctor' });
  }
};

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await doctorRepository.getDoctors();
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error getting doctors:', error);
    res.status(500).json({ message: 'Error getting doctors' });
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const idValidationResult = doctorIdSchema.safeParse(req.params); // Added
    if (!idValidationResult.success) { // Added
      return res.status(400).json({ message: 'Invalid ID format', errors: idValidationResult.error.format() });
    }
    const { id } = idValidationResult.data; // Changed

    const doctor = await doctorRepository.getDoctorById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    console.error('Error getting doctor by ID:', error);
    res.status(500).json({ message: 'Error getting doctor by ID' });
  }
};

export const updateDoctor = async (req: Request, res: Response) => {
  try {
    const idValidationResult = doctorIdSchema.safeParse(req.params); // Added
    if (!idValidationResult.success) { // Added
      return res.status(400).json({ message: 'Invalid ID format', errors: idValidationResult.error.format() });
    }
    const { id } = idValidationResult.data; // Changed

    const validationResult = updateDoctorSchema.safeParse(req.body); // Changed
    if (!validationResult.success) { // Changed
      return res.status(400).json({ message: 'Validation failed', errors: validationResult.error.format() });
    }

    if (Object.keys(validationResult.data).length === 0) {
     return res.status(400).json({ message: 'No fields to update provided' });
    }

    const doctorData = validationResult.data; // Changed
    const updatedDoctor = await doctorRepository.updateDoctor(id, doctorData);
    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(updatedDoctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    if (error instanceof ZodError) { // Should not happen
         return res.status(400).json({ message: 'Validation error in catch', errors: error.format() });
    }
    // Assuming error is PrismaError
    if (error.code === 'P2002' && error.meta?.target?.includes('registration')) {
        return res.status(409).json({ message: 'Doctor with this registration already exists' });
    }
    res.status(500).json({ message: 'Error updating doctor' });
  }
};

export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const idValidationResult = doctorIdSchema.safeParse(req.params); // Added
    if (!idValidationResult.success) { // Added
      return res.status(400).json({ message: 'Invalid ID format', errors: idValidationResult.error.format() });
    }
    const { id } = idValidationResult.data; // Changed

    const deletedDoctor = await doctorRepository.deleteDoctor(id);
    if (!deletedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json({ message: 'Doctor deleted successfully', doctor: deletedDoctor });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Error deleting doctor' });
  }
};
