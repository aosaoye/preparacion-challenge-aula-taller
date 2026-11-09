import { Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Alumno } from "../../alumno/entities/alumno.entity.js";

@Entity("talleres")
export class Taller {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    titulo: string

    @ManyToMany(() => Alumno, alumno => alumno.talleres)
    alumnos: Alumno[]
}
