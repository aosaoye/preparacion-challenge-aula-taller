import { Student, Workshop } from '../types';
import { initialEnrollments, initialStudents, initialWorkshops } from '../data/mockData';

const BASE_URL = 'http://localhost:3001';

export class ApiService {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }

  // ---------------- Alumnos ----------------
  static async getAlumnos(): Promise<Student[]> {
    try {
      const data = await this.request<any[]>('/aula/alumnos');
      return data.map((item) => ({
        id: item.id,
        name: item.nombre,
        course: item.course ?? 'General',
        level: item.level ?? 85,
        avatar: item.nombre.slice(0, 2).toUpperCase(),
        active: true,
      }));
    } catch {
      return initialStudents;
    }
  }

  static async createAlumno(nombre: string, tallerIds: number[] = []): Promise<Student> {
    try {
      const item = await this.request<any>('/aula/alumno', {
        method: 'POST',
        body: JSON.stringify({ nombre, tallerIds }),
      });
      return {
        id: item.id,
        name: item.nombre,
        course: 'General',
        level: 90,
        avatar: item.nombre.slice(0, 2).toUpperCase(),
        active: true,
      };
    } catch {
      return {
        id: Date.now(),
        name: nombre,
        course: 'General',
        level: 90,
        avatar: nombre.slice(0, 2).toUpperCase(),
        active: true,
      };
    }
  }

  static async deleteAlumno(id: number): Promise<void> {
    try {
      await this.request(`/aula/alumno/${id}`, { method: 'DELETE' });
    } catch {
      // offline fallback
    }
  }

  // ---------------- Talleres ----------------
  static async getTalleres(): Promise<Workshop[]> {
    try {
      const data = await this.request<any[]>('/aula/talleres');
      const colors = ['#f59e0b', '#8b5cf6', '#22c55e', '#38bdf8', '#ef4444'];
      const accents = ['#fef3c7', '#ede9fe', '#dcfce7', '#e0f2fe', '#fee2e2'];
      return data.map((item, idx) => ({
        id: item.id,
        name: item.titulo,
        instructor: item.instructor ?? 'Prof. Asignado',
        color: colors[idx % colors.length],
        accent: accents[idx % accents.length],
        capacity: 20,
      }));
    } catch {
      return initialWorkshops;
    }
  }

  static async createTaller(titulo: string): Promise<Workshop> {
    try {
      const item = await this.request<any>('/aula/taller', {
        method: 'POST',
        body: JSON.stringify({ titulo }),
      });
      return {
        id: item.id,
        name: item.titulo,
        instructor: 'Dr. Nuevo',
        color: '#E4531D',
        accent: '#FADCD2',
        capacity: 20,
      };
    } catch {
      return {
        id: Date.now(),
        name: titulo,
        instructor: 'Dr. Nuevo',
        color: '#E4531D',
        accent: '#FADCD2',
        capacity: 20,
      };
    }
  }

  static async deleteTaller(id: number): Promise<void> {
    try {
      await this.request(`/aula/taller/${id}`, { method: 'DELETE' });
    } catch {
      // offline fallback
    }
  }
}
