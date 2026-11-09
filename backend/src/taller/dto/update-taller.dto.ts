import { PartialType } from '@nestjs/mapped-types';
import { CreateTallerDto } from './create-taller.dto.js';

export class UpdateTallerDto extends PartialType(CreateTallerDto) {}
