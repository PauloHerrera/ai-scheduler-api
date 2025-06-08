import type { Request, Response } from 'express';
import * as doctorRepository from '../repositories/doctorRepository';

export const createDoctor = async (req: Request, res: Response) => {
  try {
    const doctorData = req.body;
    // Basic validation (can be expanded with a library like Zod)
    if (!doctorData.name || !doctorData.registration || !doctorData.expertise || !doctorData.appointmentType || doctorData.appointmentPrice === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const doctor = await doctorRepository.createDoctor(doctorData);
    res.status(201).json(doctor);
  } catch (error) {
    console.error('Error creating doctor:', error);
    // Check for unique constraint violation (e.g., duplicate registration)
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
    const { id } = req.params;
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
    const { id } = req.params;
    const doctorData = req.body;
    const updatedDoctor = await doctorRepository.updateDoctor(id, doctorData);
    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(updatedDoctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    // Check for unique constraint violation (e.g., duplicate registration)
    if (error.code === 'P2002' && error.meta?.target?.includes('registration')) {
        return res.status(409).json({ message: 'Doctor with this registration already exists' });
    }
    res.status(500).json({ message: 'Error updating doctor' });
  }
};

export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
