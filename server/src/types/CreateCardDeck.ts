import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateCardDeck {
	@Field()
	name: string

	@Field({ nullable: true})
	description?: string
}
