import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateCardDeckInput {
	@Field()
	name: string

	@Field()
	desc?: string
}
