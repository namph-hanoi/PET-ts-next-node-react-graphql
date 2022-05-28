import { Field, ID, ObjectType } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	// OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
// import { CardItem } from './CardItem'
import { User } from './User'

@ObjectType()
@Entity()
export class CardDeck extends BaseEntity {
	@Field(_type => ID)
	@PrimaryGeneratedColumn()
	id!: number

	@Field()
	@Column()
	userId!: number

	@Field()
	@Column({ unique: true })
	name!: string

	@Field()
	@Column({ nullable: true })
	description: string

	@Field(_type => User)
	@ManyToOne(() => User, user => user.cardDecks)
	user: User

    // @Field()
    // @OneToMany(() => CardItem, card => card.deck)

	@Field()
	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date

	@Field()
	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date
}
