import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Index,
} from "typeorm";
import { Base, File, User } from "./";

@Entity({ name: "secrets" })
@Index(["expiresAt"])
@Index(["user"])
export class Secret extends Base {
  @Column({ type: "bytea", name: "secret" })
  secret!: Buffer;

  @Column({ type: "bytea", name: "title", nullable: true })
  title?: Buffer;

  @Column({ type: "int", default: 1, name: "views" })
  views!: number;

  @Column({ type: "int", default: 1, name: "max_views" })
  maxViews!: number;

  @Column({ nullable: true, name: "password" })
  password?: string;

  @Column({ name: "salt", nullable: true })
  salt?: string;

  @Column({ name: "is_burnable", default: false, nullable: false })
  isBurnable!: boolean;

  @Column({ name: "expires_at" })
  expiresAt!: Date;

  @Column({ name: "ip_range", default: "", nullable: true })
  ipRange?: string;

  @ManyToOne(() => User, (user) => user.secrets, {
    nullable: true,
    onDelete: "SET NULL",
  })
  user?: User;

  @ManyToMany(() => File, (file) => file.secrets)
  @JoinTable({
    name: "secret_files",
  })
  files!: File[];
}
