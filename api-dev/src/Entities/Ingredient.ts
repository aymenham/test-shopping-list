import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { FoodTag } from "./FoodTag";
@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @ManyToOne(() => FoodTag, { nullable: true })
  @JoinColumn({ name: "foodTagId" })
  foodTag: FoodTag;

  @Column({ nullable: true })
  foodTagId: number;
}
