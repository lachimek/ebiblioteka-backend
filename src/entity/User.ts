import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { UserDetails } from "./UserDetails";

export enum UserRole {
    ADMIN = "admin",
    WORKER = "worker",
    STUDENT = "student",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    login: string;

    @Column()
    password: string;

    @OneToOne(() => UserDetails, { nullable: true, cascade: true })
    @JoinColumn()
    userDetails: UserDetails;

    @Column({ type: "enum", enum: UserRole, default: UserRole.STUDENT })
    role: UserRole;
}
