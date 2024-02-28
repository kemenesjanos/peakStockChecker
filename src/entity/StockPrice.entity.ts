import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "stock_price" })
export class StockPrice {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  symbol: string;

  @Column({ type: "real", nullable: false })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
