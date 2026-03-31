import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import { Secret, Session, Account, Base, Plan } from "./";

@Entity({ name: "user" })
export class User extends Base {
  @Column({ name: "name", nullable: true })
  name?: string;

  @Column({ unique: true, name: "username" })
  username!: string;

  @Column({ unique: true, name: "email" })
  email!: string;

  @Column({ nullable: true, name: "razorpay_customer_id", default: null })
  razorpayCustomerId?: string;

  @Column({ name: "email_verified" })
  emailVerified!: boolean;

  @Column({ nullable: true, name: "image" })
  image?: string;

  @Column({ nullable: true, name: "display_username" })
  displayUsername?: string;

  @Column({ default: "user", nullable: true, name: "role" })
  role?: string;

  @Column({ default: false, nullable: true, name: "banned" })
  banned?: boolean;

  @Column({ nullable: true, name: "ban_reason" })
  banReason?: string;

  @Column({ nullable: true, name: "ban_expires" })
  banExpires?: Date;

  @Column({ nullable: true, name: "invite_code_used" })
  inviteCodeUsed?: string;

  @Column({ default: false, nullable: true, name: "two_factor_enabled" })
  twoFactorEnabled?: boolean;

  @Column({ type: "int", default: 0, name: "monthly_file_uploads" })
  monthlyFileUploads!: number;

  @Column({ type: "varchar", length: 7, nullable: true, default: null, name: "file_upload_month_year" })
  fileUploadMonthYear?: string;

  @OneToMany(() => Secret, (secret) => secret.user)
  secrets!: Secret[];

  @OneToMany(() => Session, (session) => session.user)
  sessions!: Session[];

  @OneToMany(() => Account, (account) => account.user)
  accounts!: Account[];

  @ManyToOne(() => Plan, (plan) => plan.users)
  plan!: Plan;
}
