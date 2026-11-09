import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Aula } from './entities/aula.entity.js';
import { Alumno } from '../alumno/entities/alumno.entity.js';
import { Taller } from '../taller/entities/taller.entity.js';
import { CreateAulaDto } from './dto/create-aula.dto.js';
import { UpdateAulaDto } from './dto/update-aula.dto.js';
import { CreateAlumnoDto } from '../alumno/dto/create-alumno.dto.js';
import { UpdateAlumnoDto } from '../alumno/dto/update-alumno.dto.js';
import { CreateTallerDto } from '../taller/dto/create-taller.dto.js';
import { UpdateTallerDto } from '../taller/dto/update-taller.dto.js';

@Injectable()
export class AulaService {
  constructor(
    @InjectRepository(Aula)
    private readonly aulaRepository: Repository<Aula>,
    @InjectRepository(Alumno)
    private readonly alumnoRepository: Repository<Alumno>,
    @InjectRepository(Taller)
    private readonly tallerRepository: Repository<Taller>,
  ) {}

  // ---------------- Aula CRUD ----------------
  async create(createAulaDto: CreateAulaDto): Promise<Aula> {
    const aula = this.aulaRepository.create(createAulaDto);
    return await this.aulaRepository.save(aula);
  }

  async findAll(): Promise<Aula[]> {
    return await this.aulaRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Aula> {
    const aula = await this.aulaRepository.findOneBy({ id });
    if (!aula) {
      throw new NotFoundException(`Aula con id ${id} no encontrada`);
    }
    return aula;
  }

  async update(id: number, updateAulaDto: UpdateAulaDto): Promise<Aula> {
    const aula = await this.findOne(id);
    Object.assign(aula, updateAulaDto);
    return await this.aulaRepository.save(aula);
  }

  async remove(id: number): Promise<void> {
    const aula = await this.findOne(id);
    await this.aulaRepository.remove(aula);
  }

  // ---------------- Alumnos methods in Aula ----------------
  async alumnos(): Promise<Alumno[]> {
    return await this.alumnoRepository
      .createQueryBuilder('alumno')
      .leftJoinAndSelect('alumno.talleres', 'taller')
      .orderBy('alumno.id', 'ASC')
      .getMany();
  }

  async alumno(id: number): Promise<Alumno> {
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

  async crearAlumno(createAlumnoDto: CreateAlumnoDto): Promise<Alumno> {
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

  async actualizarAlumno(
    id: number,
    updateAlumnoDto: UpdateAlumnoDto,
  ): Promise<Alumno> {
    const alumno = await this.alumno(id);

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

  async eliminarAlumno(id: number): Promise<void> {
    const alumno = await this.alumno(id);
    await this.alumnoRepository.remove(alumno);
  }

  // ---------------- Talleres methods in Aula ----------------
  async talleres(): Promise<Taller[]> {
    return await this.tallerRepository
      .createQueryBuilder('taller')
      .leftJoinAndSelect('taller.alumnos', 'alumno')
      .orderBy('taller.id', 'ASC')
      .getMany();
  }

  async taller(id: number): Promise<Taller> {
    try {
      return await this.tallerRepository
        .createQueryBuilder('taller')
        .where('taller.id = :id', { id })
        .leftJoinAndSelect('taller.alumnos', 'alumno')
        .getOneOrFail();
    } catch {
      throw new NotFoundException(`Taller con id ${id} no encontrado`);
    }
  }

  async crearTaller(createTallerDto: CreateTallerDto): Promise<Taller> {
    const taller = this.tallerRepository.create({
      titulo: createTallerDto.titulo,
    });

    if (createTallerDto.alumnoIds && createTallerDto.alumnoIds.length > 0) {
      taller.alumnos = await this.alumnoRepository.findBy({
        id: In(createTallerDto.alumnoIds),
      });
    }

    return await this.tallerRepository.save(taller);
  }

  async actualizarTaller(
    id: number,
    updateTallerDto: UpdateTallerDto,
  ): Promise<Taller> {
    const taller = await this.taller(id);

    if (updateTallerDto.titulo !== undefined) {
      taller.titulo = updateTallerDto.titulo;
    }

    if (updateTallerDto.alumnoIds !== undefined) {
      if (updateTallerDto.alumnoIds.length > 0) {
        taller.alumnos = await this.alumnoRepository.findBy({
          id: In(updateTallerDto.alumnoIds),
        });
      } else {
        taller.alumnos = [];
      }
    }

    return await this.tallerRepository.save(taller);
  }

  async eliminarTaller(id: number): Promise<void> {
    const taller = await this.taller(id);
    await this.tallerRepository.remove(taller);
  }
}
