import { gql } from 'apollo-server'
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
        },
    },
}

export { typeDefs, resolvers }
