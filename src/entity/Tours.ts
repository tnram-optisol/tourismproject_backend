import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category";
import { Users } from "./User";

@Entity()
export class Tours{
    @PrimaryGeneratedColumn()
    tour_id: number

    @Column()
    package_name:string

    @Column()
    from:string

    @Column()
    to:string

    @Column()
    tour_image:string

    @Column()
    provider_license:string

    @Column()
    description:string

    @Column()
    availablity:boolean

    @Column()
    status:boolean

    @Column()
    startDate:string

    @Column()
    endDate:string

    @Column()
    max_person:number

    @Column()
    total_days:number

    @Column()
    cost:number

    @ManyToOne(()=>Users,{nullable:false,eager:true})
    @JoinColumn({name:'user_id'})
    user:Users

    
}