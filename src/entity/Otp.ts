import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Otp {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar" })
  email: string;

  @Column({ type: "int" })
  otp: number;

  @Column({ type: "bigint" })
  expiresIn: number;
}
