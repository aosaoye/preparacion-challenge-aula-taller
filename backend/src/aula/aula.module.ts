import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AulaService } from './aula.service.js';
import { AulaController } from './aula.controller.js';
import { Aula } from './entities/aula.entity.js';
import { Alumno } from '../alumno/entities/alumno.entity.js';
import { Taller } from '../taller/entities/taller.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Aula, Alumno, Taller])],
  controllers: [AulaController],
  providers: [AulaService],
  exports: [AulaService, TypeOrmModule],
})
export class AulaModule {}
