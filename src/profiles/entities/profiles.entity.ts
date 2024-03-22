import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn,
    OneToOne
} from "typeorm";


@Entity('profiles_roles')
export class Roles {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column({ type: 'text', nullable: true })
    description: string
    @Column({ default: false })
    administrator: boolean
    @Column({ default: false })
    moderator: boolean
    
    //
    @Column({ default: true })
    active: boolean
    @Column({ default: false })
    deleted: boolean
    @CreateDateColumn()
    createdAt: Date
    @UpdateDateColumn()
    updatedAt: Date
    
    //
    @OneToMany(() => Users, (users) => users.roles)
    users: Users[];
}


@Entity('profiles_users')
export class Users {
    @PrimaryGeneratedColumn()
    id: number
    @Column({ unique: true, nullable: true })
    username: string
    @Column({ select: false, nullable: true })
    passwordHash: string
    @Column({ unique: true, nullable: true })
    email: string
    @Column({ unique: true, nullable: true })
    phone: string
    @Column({ nullable: true })
    avatar: string
    @Column({ nullable: true })
    firstName: string
    @Column({ nullable: true })
    lastName: string
    @Column({ nullable: true })
    firstSeen: Date
    @Column({ nullable: true })
    lastSeen: Date
    
    //
    @Column({ default: true })
    active: boolean
    @Column({ default: false })
    deleted: boolean
    @CreateDateColumn()
    createdAt: Date
    @UpdateDateColumn()
    updatedAt: Date
    
    //
    @Column({ nullable: true })
    roleId: number
    @ManyToOne(() => Roles, roles => roles.users)
    @JoinColumn({ name: 'roleId' })
    roles: Roles
   
}