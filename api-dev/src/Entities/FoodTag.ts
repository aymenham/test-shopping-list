import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { FOOG_TAG } from "../Types/FoodTag";

@Entity()
export class FoodTag {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "enum", enum: FOOG_TAG, default: "" })
  @Column()
  name: string;
}
