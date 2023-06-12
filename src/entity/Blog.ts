import {
    Column,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column()
    public title: string;

    @Column()
    public content: string;
}