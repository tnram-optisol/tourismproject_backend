import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tours } from "./Tours";
import { Users } from "./User";

@Entity()
export class TourReview{
    @PrimaryGeneratedColumn()
    review_id:number

    @ManyToOne(()=>Tours,{nullable:false,eager:true})
    @JoinColumn({name:"tour_id"})
    tour:Tours

    @Column()
    posted_By:string

    @Column()
    review:string

    @Column()
    rating:number

}