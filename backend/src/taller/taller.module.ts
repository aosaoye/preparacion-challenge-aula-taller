import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TallerService } from './taller.service.js';
import { TallerController } from './taller.controller.js';
import { Taller } from './entities/taller.entity.js';
import { Alumno } from '../alumno/entities/alumno.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Taller, Alumno])],
  controllers: [TallerController],
  providers: [TallerService],
  exports: [TallerService, TypeOrmModule],
})
export class TallerModule {}
