import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Taller } from "../../taller/entities/taller.entity.js";


@Entity("alumnos")
export class Alumno {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nombre: string

    @ManyToMany(() => Taller, taller => taller.alumnos)
    @JoinTable({
        name:"alumno_taller",
        joinColumn: {
            name:"id_alumno"
        },
        inverseJoinColumn: {
            name: "id_taller"
        }
    })
    talleres: Taller[]
}
