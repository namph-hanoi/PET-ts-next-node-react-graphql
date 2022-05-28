import { CardDeck } from '../entities/CardDeck'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class PaginatedCardDecks {
	@Field()
	totalCount!: number

	@Field(_type => Date)
	cursor!: Date

	@Field()
	hasMore!: boolean

	@Field(_type => [CardDeck])
	paginatedCardDecks!: CardDeck[]
}
