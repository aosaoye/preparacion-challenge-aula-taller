import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("aulas")
export class Aula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;
}
