import { PrismaClient, Doctor } from '@prisma/client';

const prisma = new PrismaClient();

export const createDoctor = async (data: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Doctor> => {
  return prisma.doctor.create({ data });
};

export const getDoctors = async (): Promise<Doctor[]> => {
  return prisma.doctor.findMany();
};

export const getDoctorById = async (id: string): Promise<Doctor | null> => {
  return prisma.doctor.findUnique({ where: { id } });
};

export const updateDoctor = async (id: string, data: Partial<Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Doctor | null> => {
  return prisma.doctor.update({
    where: { id },
    data,
  });
};

export const deleteDoctor = async (id: string): Promise<Doctor | null> => {
  return prisma.doctor.delete({ where: { id } });
};
