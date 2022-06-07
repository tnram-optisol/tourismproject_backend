import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { BookRoom } from "./BookRoom";
import { Users } from "./User";

@Entity()
export class HotelOrders{
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

    @ManyToOne(()=>BookRoom,{nullable:false,eager:true})
    @JoinColumn({name:'book_id'})
    bookRoom :BookRoom

}