import { Pool, QueryResult } from 'pg'

export interface DBTypes {
    query: (
        text: string,
        params?: string[] | undefined
    ) => Promise<
        QueryResult<{ id: string; first_name: string; last_name: string }>
    >
}
const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mytestdb',
    password: 'sam123456',
    port: 5401,
})

export default {
    query: (
        text: string,
        params?: string[]
    ): Promise<
        QueryResult<{ id: string; first_name: string; last_name: string }>
    > => client.query(text, params),
}
