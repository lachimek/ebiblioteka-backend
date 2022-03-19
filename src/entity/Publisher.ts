import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Book } from "./Book";

@Entity()
export class Publisher {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => Book, (book) => book.publisher)
    books: Book[];
}
