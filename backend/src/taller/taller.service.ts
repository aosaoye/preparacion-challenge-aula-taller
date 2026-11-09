import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Taller } from './entities/taller.entity.js';
import { Alumno } from '../alumno/entities/alumno.entity.js';
import { CreateTallerDto } from './dto/create-taller.dto.js';
import { UpdateTallerDto } from './dto/update-taller.dto.js';

@Injectable()
export class TallerService {
  constructor(
    @InjectRepository(Taller)
    private readonly tallerRepository: Repository<Taller>,
    @InjectRepository(Alumno)
    private readonly alumnoRepository: Repository<Alumno>,
  ) {}

  async create(createTallerDto: CreateTallerDto): Promise<Taller> {
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

  async findAll(): Promise<Taller[]> {
    return await this.tallerRepository
      .createQueryBuilder('taller')
      .leftJoinAndSelect('taller.alumnos', 'alumno')
      .orderBy('taller.id', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<Taller> {
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

  async update(id: number, updateTallerDto: UpdateTallerDto): Promise<Taller> {
    const taller = await this.findOne(id);

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

  async remove(id: number): Promise<void> {
    const taller = await this.findOne(id);
    await this.tallerRepository.remove(taller);
  }
}
