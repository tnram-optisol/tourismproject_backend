import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./User";

@Entity()
export class Hotels{
    @PrimaryGeneratedColumn()
    hotel_id: number

    @Column()
    hotel_name:string

    @Column()
    latitude:string

    @Column()
    longitude:string

    @Column()
    address:string

    @Column()
    hotel_image:string

    @Column()
    hotel_license:string

    @Column()
    status:boolean

    @OneToOne(()=>Users,{nullable:false,eager:true})
    @JoinColumn({name:'user_id'})
    user:Users
}