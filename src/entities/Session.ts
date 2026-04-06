import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User, Base } from "./";

@Entity({ name: "session" })
export class Session extends Base {
  @Column({ name: "expires_at" })
  expiresAt!: Date;

  @Column({ unique: true, nullable: false, name: "token" })
  token!: string;

  @Column({ nullable: true, name: "ip_address" })
  ipAddress?: string;

  @Column({ nullable: true, name: "user_agent" })
  userAgent?: string;

  @Column({ name: "user_id" })
  userId!: string;

  @ManyToOne(() => User, (user) => user.sessions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;
}
