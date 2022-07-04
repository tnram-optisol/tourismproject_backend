import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Roles } from "./Roles";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  place: string;

  @Column({ unique: true })
  contact: string;

  @ManyToOne(() => Roles, { nullable: false, eager: true })
  @JoinColumn({ name: "role_id" })
  role: Roles;
}
