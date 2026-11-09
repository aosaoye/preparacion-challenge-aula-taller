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
import { TallerService } from './taller.service.js';
import { CreateTallerDto } from './dto/create-taller.dto.js';
import { UpdateTallerDto } from './dto/update-taller.dto.js';
import { Taller } from './entities/taller.entity.js';

@Controller('taller')
export class TallerController {
  constructor(private readonly tallerService: TallerService) {}

  @Post()
  create(@Body() createTallerDto: CreateTallerDto): Promise<Taller> {
    return this.tallerService.create(createTallerDto);
  }

  @Get()
  findAll(): Promise<Taller[]> {
    return this.tallerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Taller> {
    return this.tallerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTallerDto: UpdateTallerDto,
  ): Promise<Taller> {
    return this.tallerService.update(id, updateTallerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tallerService.remove(id);
  }
}
