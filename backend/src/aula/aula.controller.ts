import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AulaService } from './aula.service.js';
import { CreateAulaDto } from './dto/create-aula.dto.js';
import { UpdateAulaDto } from './dto/update-aula.dto.js';
import { Aula } from './entities/aula.entity.js';
import { Alumno } from '../alumno/entities/alumno.entity.js';
import { Taller } from '../taller/entities/taller.entity.js';
import { CreateAlumnoDto } from '../alumno/dto/create-alumno.dto.js';
import { UpdateAlumnoDto } from '../alumno/dto/update-alumno.dto.js';
import { CreateTallerDto } from '../taller/dto/create-taller.dto.js';
import { UpdateTallerDto } from '../taller/dto/update-taller.dto.js';

@Controller('aula')
export class AulaController {
  constructor(private readonly aulaService: AulaService) {}

  // ---------------- Sub-rutas Alumnos ----------------
  @Get('alumnos')
  alumnos(): Promise<Alumno[]> {
    return this.aulaService.alumnos();
  }

  @Get('alumnos/:id')
  alumno(@Param('id', ParseIntPipe) id: number): Promise<Alumno> {
    return this.aulaService.alumno(id);
  }

  @Post('alumno')
  crearAlumno(@Body() createAlumnoDto: CreateAlumnoDto): Promise<Alumno> {
    return this.aulaService.crearAlumno(createAlumnoDto);
  }

  @Patch('alumno/:id')
  actualizarAlumno(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAlumnoDto: UpdateAlumnoDto,
  ): Promise<Alumno> {
    return this.aulaService.actualizarAlumno(id, updateAlumnoDto);
  }

  @Delete('alumno/:id')
  eliminarAlumno(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.aulaService.eliminarAlumno(id);
  }

  // ---------------- Sub-rutas Talleres ----------------
  @Get('talleres')
  talleres(): Promise<Taller[]> {
    return this.aulaService.talleres();
  }

  @Get('talleres/:id')
  taller(@Param('id', ParseIntPipe) id: number): Promise<Taller> {
    return this.aulaService.taller(id);
  }

  @Post('taller')
  crearTaller(@Body() createTallerDto: CreateTallerDto): Promise<Taller> {
    return this.aulaService.crearTaller(createTallerDto);
  }

  @Patch('taller/:id')
  actualizarTaller(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTallerDto: UpdateTallerDto,
  ): Promise<Taller> {
    return this.aulaService.actualizarTaller(id, updateTallerDto);
  }

  @Delete('taller/:id')
  eliminarTaller(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.aulaService.eliminarTaller(id);
  }

  // ---------------- CRUD Aula ----------------
  @Post()
  create(@Body() createAulaDto: CreateAulaDto): Promise<Aula> {
    return this.aulaService.create(createAulaDto);
  }

  @Get()
  findAll(): Promise<Aula[]> {
    return this.aulaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Aula> {
    return this.aulaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAulaDto: UpdateAulaDto,
  ): Promise<Aula> {
    return this.aulaService.update(id, updateAulaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.aulaService.remove(id);
  }
}
