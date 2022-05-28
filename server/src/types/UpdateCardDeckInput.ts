import { Field, ID, InputType } from 'type-graphql'

@InputType()
export class UpdateCardDeckInput {
	@Field(_type => ID)
	id: number

	@Field()
	name: string

	@Field({ nullable: true })
	desc: string
}
