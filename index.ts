import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import http from 'http'
const PORT = 8080

import db from './src/config'
import { TypeSource, IResolvers } from '@graphql-tools/utils'
import { typeDefs, resolvers } from './src/schema'
import UserAPI from './src/user'

const startApolloServer = async (
    typeDefs: TypeSource,
    resolvers: IResolvers
) => {
    const app = express()

    const httpServer = http.createServer(app)

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({
            userAPI: new UserAPI({ db }),
        }),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    })

    const { rows } = await db.query(`SELECT * from mytable;`, [])
    console.log(rows)
    await server.start()

    server.applyMiddleware({ app })

    await new Promise<void>((resolve) =>
        httpServer.listen({ port: PORT }, resolve)
    )

    console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    )
}

startApolloServer(typeDefs, resolvers)
