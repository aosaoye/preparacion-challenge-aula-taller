import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AulaModule } from './aula/aula.module.js';
import { TallerModule } from './taller/taller.module.js';
import { AlumnoModule } from './alumno/alumno.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || process.env.DB_PASS || 'root',
      database: process.env.DB_NAME || 'control_databridge',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AulaModule,
    TallerModule,
    AlumnoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
