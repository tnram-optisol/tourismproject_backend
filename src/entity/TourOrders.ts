import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { BookTour } from "./BookTour";
import { Users } from "./User";

@Entity()
export class TourOrders{
    @PrimaryColumn()
    order_id:string

    @Column()
    purchased_by:string

    @Column()
    email:string

    @Column()
    orderCost:number

    @Column()
    description:string

    @Column()
    paymentId:string

    @Column()
    discount:number

    @Column()
    paymentStatus:boolean

    @Column()
    orderStatus:boolean

    @Column()
    orderdAt:Date

    @ManyToOne(()=>Users,{nullable:false,eager:true})
    @JoinColumn({name:"user_id"})
    user:Users

    @ManyToOne(()=>BookTour,{nullable:false,eager:true})
    @JoinColumn({name:"book_id"})
    bookTour:BookTour

}