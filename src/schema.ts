import { gql } from 'apollo-server'
import { find, remove } from 'lodash'
import UserAPI from './user'

interface Contact {
    id: string
    first_name: string
    last_name: string
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
            {
                dataSources,
            }: {
                dataSources: {
                    userAPI: UserAPI
                }
            }
        ) => {
            const result = await dataSources.userAPI.findAll()
            console.log(result)
            return result
        },
        contact(parent: undefined, args: Contact) {
            return find(contacts, { id: args.id })
        },
    },
    Mutation: {
        addContact(parent: undefined, args: Contact) {
            const newContact = {
                id: args.id,
                first_name: args.first_name,
                last_name: args.last_name,
            }
            contacts.push(newContact)

            return newContact
        },
        updateContact(parent: undefined, args: Contact) {
            const contact = find(contacts, { id: args.id })

            if (!contact) {
                throw new Error(`Contact with id ${args.id} not found`)
            }

            contact.first_name = args.first_name
            contact.last_name = args.last_name

            return contact
        },
        removeContact(parent: undefined, args: Contact) {
            const removedContact = find(contacts, { id: args.id })
            if (!removedContact) {
                throw new Error(`Contact with id ${args.id} not found`)
            }

            remove(contacts, (c) => {
                return c.id === removedContact.id
            })

            return removedContact
        },
    },
}

export { typeDefs, resolvers }
