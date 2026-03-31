import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Index,
  OneToMany,
} from "typeorm";
import { Base, User } from "./";

@Entity({ name: "plans" })
export class Plan extends Base {
  @Column({ type: "varchar", length: 255, name: "name" })
  name!: string;

  @Column({ type: "varchar", length: 255, name: "description" })
  description!: string;

  @Column({
    type: "varchar",
    length: 255,
    name: "razorpay_plan_id",
  })
  razorpayPlanId!: string;

  @Column({ type: "int", name: "price" })
  price!: number;

  @Column({ type: "int", name: "max_secrets" })
  maxSecrets!: number;

  @Column({ type: "int", name: "max_files" })
  maxFiles!: number;

  @Column({ type: "int", name: "max_views" })
  maxViews!: number;

  @Column({ type: "int", name: "max_file_size" })
  maxFileSize!: number;

  @Column({ type: "int", name: "max_file_count" })
  maxFileCount!: number;

  @Column({ type: "int", name: "max_expiry", default: 86400 }) // in seconds
  maxExpiry!: number;

  @Column({
    type: "varchar",
    length: 255,
    name: "encryption_type",
    default: "Basic AES-256 encryption",
  })
  encryptionType!: string;

  @Column({ type: "boolean", name: "has_password_protection", default: true })
  hasPasswordProtection!: boolean;

  @Column({
    type: "varchar",
    length: 255,
    name: "support_type",
    default: "Email support",
  })
  supportType!: string;

  @Column({ type: "boolean", name: "has_qr_code", default: true })
  hasQrCode!: boolean;

  @Column({ type: "boolean", name: "is_most_popular", default: false })
  isMostPopular!: boolean;

  @Column({ type: "varchar", length: 50, name: "interval", default: "month" })
  interval!: string;

  @Column({ type: "jsonb", name: "features", default: [] })
  features!: string[];

  @OneToMany(() => User, (user) => user.plan)
  users!: User[];
}
