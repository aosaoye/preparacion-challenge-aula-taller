import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlumnoService } from './alumno.service.js';
import { AlumnoController } from './alumno.controller.js';
import { Alumno } from './entities/alumno.entity.js';
import { Taller } from '../taller/entities/taller.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Alumno, Taller])],
  controllers: [AlumnoController],
  providers: [AlumnoService],
  exports: [AlumnoService, TypeOrmModule],
})
export class AlumnoModule {}
