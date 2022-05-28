import { Field, ObjectType } from 'type-graphql'
import { IMutationResponse } from './MutationResponse'
import { FieldError } from './FieldError'
import { CardDeck } from '../entities/CardDeck'

@ObjectType({ implements: IMutationResponse })
export class CardMutationResponse implements IMutationResponse {
	code: number
	success: boolean
	message?: string

	@Field({ nullable: true })
	cardDeck?: CardDeck

	@Field(_type => [FieldError], { nullable: true })
	errors?: FieldError[]
}
