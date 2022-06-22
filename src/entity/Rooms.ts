import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Hotels } from "./Hotels";

@Entity()
export class Rooms {
  @PrimaryGeneratedColumn()
  room_id: number;

  @Column()
  room_name: string;

  @Column()
  room_price: number;

  @Column()
  room_image: string;

  @Column()
  max_person: string;

  @Column()
  availablity: boolean;

  @Column()
  description: string;

  @ManyToOne(() => Hotels, { nullable: false, eager: true })
  @JoinColumn({ name: "hotel_id" })
  hotel: Hotels;
}
