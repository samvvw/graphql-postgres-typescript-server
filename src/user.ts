import { DataSource } from 'apollo-datasource'
import { DBTypes } from './config'

class UserAPI extends DataSource {
    db: DBTypes
    constructor({ db }: { db: DBTypes }) {
        super()
        this.db = db
    }

    async findAll() {
        const { rows } = await this.db.query('SELECT * from mytable')

        return rows
    }

    async findById(id: string) {
        const { rows } = await this.db.query(
            'SELECT * FROM mytable WHERE id = $1',
            [id]
        )
        return rows[0]
    }

    async insertContact(id: string, firstName: string, lastName: string) {
        try {
            await this.db.query(
                'INSERT INTO mytable(id, first_name, last_name) VALUES ($1, $2, $3)',
                [id, firstName, lastName]
            )
            const newContact = await this.findById(id)
            return newContact
        } catch (error) {
            /**
             *  Using type assertion for the error as we know the keys that
             *  that come from the error object returned from 'pg'
             */
            const err = error as {
                detail: string
            }
            console.log(err.detail)
            if (error instanceof Error) {
                console.log(error.stack)
            }
            return error
        }
    }

    async updateContact(id: string, firstName: string, lastName: string) {
        try {
            const CHANGE_FIRST_AND_LAST =
                'UPDATE mytable SET first_name=$2, last_name=$3 WHERE id=$1'
            const CHANGE_FIRST_ONLY =
                'UPDATE mytable SET first_name=$2 WHERE id=$1'
            const CHANGE_LAST_ONLY =
                'UPDATE mytable SET last_name=$2 WHERE id=$1'
            const query =
                firstName && lastName
                    ? CHANGE_FIRST_AND_LAST
                    : firstName && !lastName
                    ? CHANGE_FIRST_ONLY
                    : !firstName && lastName
                    ? CHANGE_LAST_ONLY
                    : ''

            const values = [id, firstName, lastName].filter(
                (e) => e !== undefined && e
            )

            await this.db.query(query, values)

            const updatedElement = await this.findById(id)
            return updatedElement
        } catch (error) {
            console.log(error)
            return error
        }

        // Delete contact method
    }
}

export default UserAPI
