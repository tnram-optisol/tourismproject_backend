import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category";
import { Tours } from "./Tours";

@Entity()
export class TourCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  closed_on: Date;

  @OneToOne(() => Tours, { nullable: false, eager: true })
  @JoinColumn({ name: "tour" })
  tour: Tours;

  @Column({ array: true })
  category: number;

  @Column({ nullable: true, type: "float" })
  rating: number;
}
