import request from 'supertest';
import express from 'express';
import doctorRoutes from '../routes/doctorRoutes'; // Adjust path as necessary
import * as doctorRepository from '../repositories/doctorRepository';

// Mock the repository functions
jest.mock('../repositories/doctorRepository');

const app = express();
app.use(express.json());
app.use('/doctors', doctorRoutes); // Mount at a base path for testing

describe('Doctor API', () => {
  const mockDoctor = {
    id: 'mock-id-1',
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

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/doctors').send({ name: 'Dr. Incomplete' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Missing required fields');
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
      const mockDoctors = [mockDoctor, { ...mockDoctor, id: 'mock-id-2', registration: 'CRM67890' }];
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
      const res = await request(app).get(`/doctors/${mockDoctor.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        ...mockDoctor,
        createdAt: mockDoctor.createdAt.toISOString(),
        updatedAt: mockDoctor.updatedAt.toISOString(),
      });
      expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(mockDoctor.id);
    });

    it('should return 404 if doctor not found', async () => {
      (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(null);
      const res = await request(app).get('/doctors/non-existent-id');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Doctor not found');
    });
  });

  describe('PUT /doctors/:id', () => {
    const updatedData = { name: 'Dr. Updated Mock' };
    it('should update a doctor and return 200', async () => {
      const updatedDoctor = { ...mockDoctor, ...updatedData };
      (doctorRepository.updateDoctor as jest.Mock).mockResolvedValue(updatedDoctor);
      const res = await request(app).put(`/doctors/${mockDoctor.id}`).send(updatedData);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        ...updatedDoctor,
        createdAt: updatedDoctor.createdAt.toISOString(),
        updatedAt: updatedDoctor.updatedAt.toISOString(),
      });
      expect(doctorRepository.updateDoctor).toHaveBeenCalledWith(mockDoctor.id, updatedData);
    });

    it('should return 404 if doctor to update not found', async () => {
      (doctorRepository.updateDoctor as jest.Mock).mockResolvedValue(null);
      const res = await request(app).put('/doctors/non-existent-id').send(updatedData);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Doctor not found');
    });
     it('should return 409 if updated registration already exists', async () => {
      (doctorRepository.updateDoctor as jest.Mock).mockRejectedValue({ code: 'P2002', meta: { target: ['registration'] } });
      const res = await request(app).put(`/doctors/${mockDoctor.id}`).send({ registration: 'CRM_TAKEN' });
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Doctor with this registration already exists');
    });
  });

  describe('DELETE /doctors/:id', () => {
    it('should delete a doctor and return 200', async () => {
      (doctorRepository.deleteDoctor as jest.Mock).mockResolvedValue(mockDoctor);
      const res = await request(app).delete(`/doctors/${mockDoctor.id}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Doctor deleted successfully');
      expect(res.body.doctor).toEqual({
        ...mockDoctor,
        createdAt: mockDoctor.createdAt.toISOString(),
        updatedAt: mockDoctor.updatedAt.toISOString(),
      });
      expect(doctorRepository.deleteDoctor).toHaveBeenCalledWith(mockDoctor.id);
    });

    it('should return 404 if doctor to delete not found', async () => {
      (doctorRepository.deleteDoctor as jest.Mock).mockResolvedValue(null);
      const res = await request(app).delete('/doctors/non-existent-id');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Doctor not found');
    });
  });
});
