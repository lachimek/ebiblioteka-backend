import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Book } from "./Book";

@Entity()
export class Genre {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    name: string;
}
