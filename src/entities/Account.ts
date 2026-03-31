import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User, Base } from "./";

@Entity({ name: "account" })
export class Account extends Base {
  @Column({ name: "account_id" })
  accountId!: string;

  @Column({ name: "provider_id" })
  providerId!: string;

  @Column({ name: "user_id" })
  userId!: string;

  @ManyToOne(() => User, (user) => user.accounts, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ nullable: true, name: "access_token" })
  accessToken?: string;

  @Column({ nullable: true, name: "refresh_token" })
  refreshToken?: string;

  @Column({ nullable: true, name: "id_token" })
  idToken?: string;

  @Column({ nullable: true, name: "access_token_expires_at" })
  accessTokenExpiresAt?: Date;

  @Column({ nullable: true, name: "refresh_token_expires_at" })
  refreshTokenExpiresAt?: Date;

  @Column({ nullable: true, name: "scope" })
  scope?: string;

  @Column({ nullable: true, name: "password" })
  password?: string;
}
