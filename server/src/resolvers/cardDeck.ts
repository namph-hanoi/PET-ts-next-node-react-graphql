import { UpdateCardDeckInput } from '../types/UpdateCardDeckInput'
import {
	Arg,
	Ctx,
	FieldResolver,
	ID,
	Int,
	Mutation,
	Query,
	registerEnumType,
	Resolver,
	Root,
	UseMiddleware
} from 'type-graphql';
import { CardDeck } from '../entities/CardDeck';
import { CreateCardDeckInput } from '../types/CreateCardDeckInput'
import { checkAuth } from '../middleware/checkAuth'
import { User } from '../entities/User'
import { LessThan } from 'typeorm'
import { Context } from '../types/Context'
import { VoteType } from '../types/VoteType'
import { PaginatedCardDecks } from '../types/PaginatedCardDeck';
import { CardDeckMutationResponse } from '../types/CardDeckMutationResponse';

registerEnumType(VoteType, {
	name: 'VoteType' // this one is mandatory
})

@Resolver(_of => CardDeck)
export class CardDeckResolver {
	@FieldResolver(_return => User)
	async user(
		@Root() root: CardDeck,
		@Ctx() { dataLoaders: { userLoader } }: Context
	) {
		// return await User.findOne(root.userId)
		return await userLoader.load(root.userId)
	}

	@Mutation(_return => CardDeckMutationResponse)
	@UseMiddleware(checkAuth)
	async createCardDeck(
		@Arg('createCardDeckInput') { name, desc: description }: CreateCardDeckInput,
		@Ctx() { req }: Context
	): Promise<CardDeckMutationResponse> {
		try {
			const newCardDeck = CardDeck.create({
				name,
				description,
				userId: req.session.userId
			})

			await newCardDeck.save()

			return {
				code: 200,
				success: true,
				message: 'Card deck created successfully',
				cardDeck: newCardDeck
			}
		} catch (error) {
			console.log(error)
			return {
				code: 500,
				success: false,
				message: `Internal server error ${error.message}`
			}
		}
	}

	@Query(_return => PaginatedCardDecks, { nullable: true })
	async listAllCardDecks(
		@Arg('limit', _type => Int) limit: number,
		@Arg('cursor', { nullable: true }) cursor?: string
	): Promise<PaginatedCardDecks | null> {
		try {
			const totalDeckCount = await CardDeck.count()
			const realLimit = Math.min(10, limit)

			const findOptions: { [key: string]: any } = {
				order: {
					createdAt: 'DESC'
				},
				take: realLimit
			}

			let lastDeck: CardDeck | undefined
			if (cursor) {
				findOptions.where = { createdAt: LessThan(cursor) }

				lastDeck = await CardDeck.findOne({ order: { createdAt: 'ASC' } })
			}

			const cardDecks = await CardDeck.find(findOptions)

			return {
				totalCount: totalDeckCount,
				cursor: cardDecks[cardDecks.length - 1].createdAt,
				hasMore: cursor
					? cardDecks[cardDecks.length - 1].createdAt.toString() !==
					  lastDeck?.createdAt.toString()
					: cardDecks.length !== totalDeckCount,
				paginatedCardDecks: cardDecks
			}
		} catch (error) {
			console.log(error)
			return null
		}
	}

	@Query(_return => CardDeck, { nullable: true })
	async findDeck(@Arg('id', _type => ID) id: number): Promise<CardDeck | undefined> {
		try {
			const deck = await CardDeck.findOne(id)
			return deck
		} catch (error) {
			console.log(error)
			return undefined
		}
	}

	@Mutation(_return => CardDeckMutationResponse)
	@UseMiddleware(checkAuth)
	async updateCardDeck(
		@Arg('updateCardDeckInput') { id, name, desc }: UpdateCardDeckInput,
		@Ctx() { req }: Context
	): Promise<CardDeckMutationResponse> {
		const existingCardDeck = await CardDeck.findOne(id)
		if (!existingCardDeck)
			return {
				code: 400,
				success: false,
				message: 'Card deck not found'
			}

		if (existingCardDeck.userId !== req.session.userId) {
			return { code: 401, success: false, message: 'Unauthorised' }
		}

		existingCardDeck.name = name
		existingCardDeck.description = desc

		await existingCardDeck.save()

		return {
			code: 200,
			success: true,
			message: 'Card updated successfully',
			cardDeck: existingCardDeck
		}
	}

	@Mutation(_return => CardDeckMutationResponse)
	@UseMiddleware(checkAuth)
	async deleteCardDeck(
		@Arg('id', _type => ID) id: number,
		@Ctx() { req }: Context
	): Promise<CardDeckMutationResponse> {
		const existingCardDeck = await CardDeck.findOne(id)
		if (!existingCardDeck)
			return {
				code: 400,
				success: false,
				message: 'Card deck not found'
			}

		if (existingCardDeck.userId !== req.session.userId) {
			return { code: 401, success: false, message: 'Unauthorised' }
		}

		await CardDeck.delete({ id })

		return { code: 200, success: true, message: 'Card deck deleted successfully' }
	}

}
