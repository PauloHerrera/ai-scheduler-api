import request from 'supertest';
import express from 'express';
import doctorRoutes from '../routes/doctorRoutes'; // Adjust path as necessary
import * as doctorRepository from '../repositories/doctorRepository';

// Mock the repository functions
jest.mock('../repositories/doctorRepository');

const app = express();
app.use(express.json());
app.use('/doctors', doctorRoutes); // Mount at a base path for testing

const validUUID = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
const invalidUUID = 'invalid-uuid-format';

describe('Doctor API', () => {
  const mockDoctor = {
    id: validUUID, // Changed to valid UUID
    name: 'Dr. Mock',
    registration: 'CRM12345',
    expertise: 'Testing',
    appointmentType: ['PRIVATE'],
    appointmentPrice: 150.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const newDoctorData = {
    name: 'Dr. New',
    registration: 'CRM54321',
    expertise: 'Development',
    appointmentType: ['HEALTH_PLAN'],
    appointmentPrice: 100.00,
  };

  beforeEach(() => {
    // Reset mocks before each test
    (doctorRepository.createDoctor as jest.Mock).mockReset();
    (doctorRepository.getDoctors as jest.Mock).mockReset();
    (doctorRepository.getDoctorById as jest.Mock).mockReset();
    (doctorRepository.updateDoctor as jest.Mock).mockReset();
    (doctorRepository.deleteDoctor as jest.Mock).mockReset();
  });

  describe('POST /doctors', () => {
    it('should create a new doctor and return 201', async () => {
      (doctorRepository.createDoctor as jest.Mock).mockResolvedValue(mockDoctor);
      const res = await request(app).post('/doctors').send(newDoctorData);
      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        ...mockDoctor,
        createdAt: mockDoctor.createdAt.toISOString(),
        updatedAt: mockDoctor.updatedAt.toISOString(),
      });
      expect(doctorRepository.createDoctor).toHaveBeenCalledWith(newDoctorData);
    });

    it('should return 400 if required fields are missing (e.g., name)', async () => {
      const incompleteData = { ...newDoctorData };
      delete incompleteData.name;
      const res = await request(app).post('/doctors').send(incompleteData);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
      expect(res.body.errors).toHaveProperty('name');
      expect(res.body.errors.name._errors[0]).toBe('Required'); // Changed from "Name is required"
    });

    it('should return 400 for invalid registration (empty string)', async () => {
        const res = await request(app).post('/doctors').send({ ...newDoctorData, registration: "" });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Validation failed');
        expect(res.body.errors).toHaveProperty('registration');
        expect(res.body.errors.registration._errors[0]).toBe('Registration is required');
    });

    it('should return 400 for invalid appointmentPrice (string)', async () => {
        const res = await request(app).post('/doctors').send({ ...newDoctorData, appointmentPrice: "not-a-number" });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Validation failed');
        expect(res.body.errors).toHaveProperty('appointmentPrice');
    });

    it('should return 400 for empty appointmentType array', async () => {
        const res = await request(app).post('/doctors').send({ ...newDoctorData, appointmentType: [] });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Validation failed');
        expect(res.body.errors).toHaveProperty('appointmentType');
        expect(res.body.errors.appointmentType._errors[0]).toBe('At least one appointment type is required');
    });


    it('should return 409 if doctor with this registration already exists', async () => {
      (doctorRepository.createDoctor as jest.Mock).mockRejectedValue({ code: 'P2002', meta: { target: ['registration'] } });
      const res = await request(app).post('/doctors').send(newDoctorData);
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Doctor with this registration already exists');
    });
  });

  describe('GET /doctors', () => {
    it('should return a list of doctors and status 200', async () => {
      const mockDoctors = [mockDoctor, { ...mockDoctor, id: 'a1b2c3d4-e5f6-7890-1234-567890abcde0', registration: 'CRM67890' }]; // Ensure second ID is also valid UUID
      (doctorRepository.getDoctors as jest.Mock).mockResolvedValue(mockDoctors);
      const res = await request(app).get('/doctors');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        mockDoctors.map(d => ({
          ...d,
          createdAt: d.createdAt.toISOString(),
          updatedAt: d.updatedAt.toISOString(),
        }))
      );
      expect(doctorRepository.getDoctors).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /doctors/:id', () => {
    it('should return a single doctor if found and status 200', async () => {
      (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(mockDoctor);
      const res = await request(app).get(`/doctors/${validUUID}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        ...mockDoctor,
        id: validUUID,
        createdAt: mockDoctor.createdAt.toISOString(),
        updatedAt: mockDoctor.updatedAt.toISOString(),
      });
      expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(validUUID);
    });

    it('should return 404 if doctor not found', async () => {
      (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(null);
      const res = await request(app).get(`/doctors/${validUUID}`); // Use valid UUID for not found case
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Doctor not found');
    });

    it('should return 400 for invalid ID format', async () => {
        const res = await request(app).get(`/doctors/${invalidUUID}`);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid ID format');
        expect(res.body.errors).toHaveProperty('id');
        expect(res.body.errors.id._errors[0]).toBe('Invalid UUID format for doctor ID');
    });
  });

  describe('PUT /doctors/:id', () => {
    const updatedData = { name: 'Dr. Updated Mock', appointmentPrice: 300 };
    it('should update a doctor and return 200', async () => {
      const updatedDoctorResult = { ...mockDoctor, ...updatedData, id: validUUID };
      (doctorRepository.updateDoctor as jest.Mock).mockResolvedValue(updatedDoctorResult);
      const res = await request(app).put(`/doctors/${validUUID}`).send(updatedData);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        ...updatedDoctorResult,
        createdAt: updatedDoctorResult.createdAt.toISOString(),
        updatedAt: updatedDoctorResult.updatedAt.toISOString(),
      });
      expect(doctorRepository.updateDoctor).toHaveBeenCalledWith(validUUID, updatedData);
    });

    it('should return 404 if doctor to update not found', async () => {
      (doctorRepository.updateDoctor as jest.Mock).mockResolvedValue(null);
      const res = await request(app).put(`/doctors/${validUUID}`).send(updatedData);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Doctor not found');
    });

    it('should return 400 for invalid ID format', async () => {
        const res = await request(app).put(`/doctors/${invalidUUID}`).send(updatedData);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid ID format');
        expect(res.body.errors).toHaveProperty('id');
    });

    it('should return 400 if trying to update with invalid data type (e.g. appointmentPrice as string)', async () => {
        const res = await request(app).put(`/doctors/${validUUID}`).send({ appointmentPrice: "expensive" });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Validation failed');
        expect(res.body.errors).toHaveProperty('appointmentPrice');
    });

    it('should return 400 if sending an empty object for update', async () => {
        const res = await request(app).put(`/doctors/${validUUID}`).send({});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('No fields to update provided');
    });

     it('should return 409 if updated registration already exists', async () => {
      (doctorRepository.updateDoctor as jest.Mock).mockRejectedValue({ code: 'P2002', meta: { target: ['registration'] } });
      const res = await request(app).put(`/doctors/${validUUID}`).send({ registration: 'CRM_TAKEN' });
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Doctor with this registration already exists');
    });
  });

  describe('DELETE /doctors/:id', () => {
    it('should delete a doctor and return 200', async () => {
      (doctorRepository.deleteDoctor as jest.Mock).mockResolvedValue({...mockDoctor, id: validUUID});
      const res = await request(app).delete(`/doctors/${validUUID}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Doctor deleted successfully');
      expect(res.body.doctor).toEqual({
        ...mockDoctor,
        id: validUUID,
        createdAt: mockDoctor.createdAt.toISOString(),
        updatedAt: mockDoctor.updatedAt.toISOString(),
      });
      expect(doctorRepository.deleteDoctor).toHaveBeenCalledWith(validUUID);
    });

    it('should return 404 if doctor to delete not found', async () => {
      (doctorRepository.deleteDoctor as jest.Mock).mockResolvedValue(null);
      const res = await request(app).delete(`/doctors/${validUUID}`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Doctor not found');
    });

    it('should return 400 for invalid ID format', async () => {
        const res = await request(app).delete(`/doctors/${invalidUUID}`);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid ID format');
        expect(res.body.errors).toHaveProperty('id');
    });
  });
});
