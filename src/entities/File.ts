import { Entity, Column, ManyToMany } from "typeorm";
import { Secret, Base } from "./";

@Entity({ name: "files" })
export class File extends Base {
  @Column({ name: "filename" })
  filename!: string;

  @Column({ name: "original_filename" })
  originalFilename!: string;

  @Column({ name: "file_full_path" })
  fileFullPath!: string;

  @Column({ name: "path" })
  path!: string;

  @Column({ name: "status", default: "pending" })
  status!: string;

  @Column({ name: "file_size" })
  fileSize!: number;

  @Column({ name: "content_type" })
  contentType!: string;

  @ManyToMany(() => Secret, (secret) => secret.files)
  secrets!: Secret[];
}
