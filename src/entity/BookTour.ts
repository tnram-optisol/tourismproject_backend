import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tours } from "./Tours";
import { Users } from "./User";

@Entity()
export class BookTour{
    @PrimaryGeneratedColumn()
    book_id:number

    @Column()
    max_person:number

    @Column()
    book_date:string

    @Column()
    book_status:boolean

    @Column()
    payment:boolean

    @ManyToOne(()=>Users,{eager:true,nullable:false})
    @JoinColumn({name:"user_id"})
    user:Users

    @ManyToOne(()=>Tours,{eager:true,nullable:false})
    @JoinColumn({name:"tour_id"})
    tour:Tours
}