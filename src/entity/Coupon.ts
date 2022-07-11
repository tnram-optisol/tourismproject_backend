import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn({ type: "int" })
  coupon_id: number;

  @Column({ type: "varchar" })
  coupon_name: string;

  @Column({ type: "int" })
  percent_off: number;

  @Column({ type: "date" })
  addedOn: Date;
}
