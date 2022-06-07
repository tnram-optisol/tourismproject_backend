import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Roles{
    @PrimaryGeneratedColumn()
    id :number

    @Column()
    role : string
}