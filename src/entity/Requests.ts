import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "./Roles";
import { Users } from "./User";

@Entity()
export class Requests{
    @PrimaryGeneratedColumn()
    request_id: number

    @Column()
    status:boolean

    @ManyToOne(()=>Users,{nullable:false,eager:true})
    @JoinColumn({name:"user_id"})
    user:Users

    
}