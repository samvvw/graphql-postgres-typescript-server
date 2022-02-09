import { gql } from 'apollo-server'
import { find, remove } from 'lodash'
import UserAPI from './user'

interface User {
    id: number
    userName: string
}
interface Contact {
    id: string
    first_name: string
    last_name: string
}

interface UserDataSource {
    dataSources: {
        userAPI: UserAPI
    }
    user: User | null
}

const contacts: Contact[] = [
    {
        id: '1',
        first_name: 'Paul',
        last_name: 'Lam',
    },
    {
        id: '2',
        first_name: 'John',
        last_name: 'Smith',
    },
    {
        id: '3',
        first_name: 'Jane',
        last_name: 'Doe',
    },
]

const typeDefs = gql`
    type Contact {
        id: String!
        first_name: String
        last_name: String
    }

    type Query {
        contacts: [Contact]
        contact(id: String!): Contact
    }

    type Mutation {
        addContact(
            id: String!
            first_name: String!
            last_name: String!
        ): Contact
        updateContact(
            id: String!
            first_name: String
            last_name: String
        ): Contact
        removeContact(id: String!): Contact
    }
`

const resolvers = {
    Query: {
        contacts: async (
            _: undefined,
            __: undefined,
            { dataSources, user }: UserDataSource
        ) => {
            if (user) {
                const result = await dataSources.userAPI.findAll()
                console.log(result)
                return result
            }
            return null
        },
        contact: async (
            parent: undefined,
            args: Contact,
            { dataSources, user }: UserDataSource
        ) => {
            if (user) {
                return await dataSources.userAPI.findById(args.id)
            }
            return null
        },
    },
    Mutation: {
        addContact: async (
            parent: undefined,
            args: Contact,
            { dataSources, user }: UserDataSource
        ) => {
            if (user) {
                return await dataSources.userAPI.insertContact(
                    args.id,
                    args.first_name,
                    args.last_name
                )
            }
            return null
        },
        updateContact: async (
            parent: undefined,
            args: Contact,
            { dataSources, user }: UserDataSource
        ) => {
            if (user) {
                return await dataSources.userAPI.updateContact(
                    args.id,
                    args.first_name,
                    args.last_name
                )
            }
            return null
            // const contact = find(contacts, { id: args.id })
            // if (!contact) {
            //     throw new Error(`Contact with id ${args.id} not found`)
            // }
            // contact.first_name = args.first_name
            // contact.last_name = args.last_name
            // return contact
        },
        removeContact: async (
            parent: undefined,
            args: Contact,
            { dataSources, user }: UserDataSource
        ) => {
            if (user) {
                return await dataSources.userAPI.deleteContact(args.id)
            }
            return null
            // const removedContact = find(contacts, { id: args.id })
            // if (!removedContact) {
            //     throw new Error(`Contact with id ${args.id} not found`)
            // }
            // remove(contacts, (c) => {
            //     return c.id === removedContact.id
            // })
            // return removedContact
        },
    },
}

export { typeDefs, resolvers }
