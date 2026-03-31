import { Entity, Column } from "typeorm";
import { Base } from "./Base";

@Entity({ name: "webhooks" })
export class Webhook extends Base {
  @Column({ name: "event" })
  event!: string;

  @Column({ name: "payload", type: "json" })
  payload!: string;
}
