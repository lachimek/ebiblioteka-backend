import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class BooksAmountHistory {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    amount: number;

    @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;
}
