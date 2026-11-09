import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Alumno } from './entities/alumno.entity.js';
import { Taller } from '../taller/entities/taller.entity.js';
import { CreateAlumnoDto } from './dto/create-alumno.dto.js';
import { UpdateAlumnoDto } from './dto/update-alumno.dto.js';

@Injectable()
export class AlumnoService {
  constructor(
    @InjectRepository(Alumno)
    private readonly alumnoRepository: Repository<Alumno>,
    @InjectRepository(Taller)
    private readonly tallerRepository: Repository<Taller>,
  ) {}

  async create(createAlumnoDto: CreateAlumnoDto): Promise<Alumno> {
    const alumno = this.alumnoRepository.create({
      nombre: createAlumnoDto.nombre,
    });

    if (createAlumnoDto.tallerIds && createAlumnoDto.tallerIds.length > 0) {
      alumno.talleres = await this.tallerRepository.findBy({
        id: In(createAlumnoDto.tallerIds),
      });
    }

    return await this.alumnoRepository.save(alumno);
  }

  async findAll(): Promise<Alumno[]> {
    return await this.alumnoRepository
      .createQueryBuilder('alumno')
      .leftJoinAndSelect('alumno.talleres', 'taller')
      .orderBy('alumno.id', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<Alumno> {
    try {
      return await this.alumnoRepository
        .createQueryBuilder('alumno')
        .where('alumno.id = :id', { id })
        .leftJoinAndSelect('alumno.talleres', 'taller')
        .getOneOrFail();
    } catch {
      throw new NotFoundException(`Alumno con id ${id} no encontrado`);
    }
  }

  async update(id: number, updateAlumnoDto: UpdateAlumnoDto): Promise<Alumno> {
    const alumno = await this.findOne(id);

    if (updateAlumnoDto.nombre !== undefined) {
      alumno.nombre = updateAlumnoDto.nombre;
    }

    if (updateAlumnoDto.tallerIds !== undefined) {
      if (updateAlumnoDto.tallerIds.length > 0) {
        alumno.talleres = await this.tallerRepository.findBy({
          id: In(updateAlumnoDto.tallerIds),
        });
      } else {
        alumno.talleres = [];
      }
    }

    return await this.alumnoRepository.save(alumno);
  }

  async remove(id: number): Promise<void> {
    const alumno = await this.findOne(id);
    await this.alumnoRepository.remove(alumno);
  }
}