import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { UserDetails } from "./UserDetails";

@Entity()
export class Group {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @OneToMany(() => UserDetails, (details) => details.group)
    details: UserDetails[];
}
