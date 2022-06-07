import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Rooms } from "./Rooms";
import { Users } from "./User";

@Entity()
export class BookRoom{
    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(()=>Users,{nullable:false,eager:true})
    @JoinColumn({name:'user_id'})
    user:Users

    @ManyToOne(()=>Rooms,{nullable:false,eager:true})
    @JoinColumn({name:'room_id'})
    room:Rooms

    @Column()
    in_Date:string

    @Column()
    out_Date:string

    @Column()
    total_Days:number
    
    @Column()
    total_person:number

    @Column()
    book_status:boolean

    @Column()
    payment:boolean

}