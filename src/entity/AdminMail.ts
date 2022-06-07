import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AdminMail{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    user_name :string

    @Column()
    user_mail:string

    @Column()
    user_message:string

}