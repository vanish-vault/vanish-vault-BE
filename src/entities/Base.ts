import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "base" })
export class Base {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Column({ nullable: false, default: "SYSTEM", name: "created_by" })
  createdBy!: string;

  @Column({ nullable: false, default: "SYSTEM", name: "updated_by" })
  updatedBy!: string;
}
