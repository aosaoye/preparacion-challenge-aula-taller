import { EnrollmentMap, Student, Workshop } from '../types';

export const initialStudents: Student[] = [
    { id: 1, name: 'Ana López', course: 'Matemáticas', level: 92, avatar: 'AL', active: true },
    { id: 2, name: 'Mateo Ruiz', course: 'Física', level: 88, avatar: 'MR', active: true },
    { id: 3, name: 'Sofía Pérez', course: 'Química', level: 94, avatar: 'SP', active: true },
    { id: 4, name: 'Daniel García', course: 'Informática', level: 81, avatar: 'DG', active: false },
    { id: 5, name: 'Laura Torres', course: 'Biología', level: 90, avatar: 'LT', active: true },
    { id: 6, name: 'Pablo Ortega', course: 'Historia', level: 76, avatar: 'PO', active: false },
    { id: 7, name: 'Clara Vela', course: 'Artes', level: 89, avatar: 'CV', active: true },
    { id: 8, name: 'Lucas Vega', course: 'Física', level: 85, avatar: 'LV', active: false },
];

export const initialWorkshops: Workshop[] = [
    { id: 1, name: 'Física', instructor: 'Dr. Emily Carter', color: '#f59e0b', accent: '#fef3c7', capacity: 18 },
    { id: 2, name: 'Matemáticas', instructor: 'Dr. Ana Flores', color: '#8b5cf6', accent: '#ede9fe', capacity: 15 },
    { id: 3, name: 'Programación', instructor: 'Dr. Marco Lee', color: '#22c55e', accent: '#dcfce7', capacity: 20 },
    { id: 4, name: 'Química', instructor: 'Dr. Carla Díaz', color: '#38bdf8', accent: '#e0f2fe', capacity: 12 },
];

export const initialEnrollments: EnrollmentMap = {
    1: [1, 2, 3, 5],
    2: [1, 4, 7],
    3: [2, 3, 6, 8],
    4: [5, 1, 7],
};
