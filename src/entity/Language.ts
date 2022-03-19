import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Book } from "./Book";

@Entity()
export class Language {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    language: string;

    @OneToMany(() => Book, (book) => book.language)
    books: Book[];
}
