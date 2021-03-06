import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Book } from "./Book";
import { User } from "./User";

@Entity()
export class IssueHistory {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Book, (book) => book.issueHistory)
    book: Book;

    @ManyToOne(() => User, (user) => user.issueHistory)
    member: User;

    @Column({ name: "issue_date" })
    issueDate: Date;

    @Column({ name: "expected_return_date" })
    expectedReturnDate: Date;

    @Column({ name: "return_date", nullable: true })
    returnDate: Date;

    @Column({ default: false })
    returned: boolean;
}
