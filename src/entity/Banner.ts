import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Tours } from "./Tours";

@Entity()
export class Banner {
  @PrimaryGeneratedColumn()
  banner_id: number;

  @ManyToOne(() => Tours, { nullable: false, eager: true })
  @JoinColumn({ name: "tour_id" })
  tour: Tours;

  @Column()
  sequence: number;

  @Column({ nullable: true, type: 'float' })
  rating:number
}
