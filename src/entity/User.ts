import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    login: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

}
