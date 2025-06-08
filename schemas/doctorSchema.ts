import { z } from 'zod';

export const doctorIdSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format for doctor ID" }),
});

export const createDoctorSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  registration: z.string().min(1, { message: "Registration is required" }),
  expertise: z.string().min(1, { message: "Expertise is required" }),
  appointmentType: z.array(z.string()).min(1, { message: "At least one appointment type is required" }),
  appointmentPrice: z.number().positive({ message: "Appointment price must be a positive number" }),
});

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;

export const updateDoctorSchema = createDoctorSchema.partial();

export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
