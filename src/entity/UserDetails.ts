import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Group } from "./Group";
@Entity()
export class UserDetails {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "first_name" })
    firstName: string;

    @Column({ name: "last_name" })
    lastName: string;

    @Column()
    email: string;

    @ManyToOne(() => Group, (group) => group.details, { nullable: true, cascade: true })
    group: Group;

    @Column()
    phone: string;

    @Column()
    city: string;

    @Column({ name: "postal_code" })
    postalCode: string;

    @Column({ name: "street_address" })
    streetAddress: string;
}
