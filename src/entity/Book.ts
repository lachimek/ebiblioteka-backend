import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    OneToMany,
    ManyToOne,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { Author } from "./Author";
import { Genre } from "./Genre";
import { Language } from "./Language";
import { Publisher } from "./Publisher";

@Entity()
export class Book {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    isbn: string;

    @Column()
    title: string;

    @Column({ name: "publication_date" })
    publicationDate: Date;

    @ManyToOne(() => Language, (language) => language.books)
    language: Language;

    @ManyToOne(() => Publisher, (publisher) => publisher.books)
    publisher: Publisher;

    @ManyToMany(() => Genre)
    @JoinTable()
    genres: Genre[];

    @ManyToOne(() => Author, (author) => author.books)
    @JoinTable()
    author: Author;

    @Column({ default: "" })
    description: string;

    @Column({ default: true })
    available: boolean;

    @Column({ default: false })
    deleted: boolean;
}
