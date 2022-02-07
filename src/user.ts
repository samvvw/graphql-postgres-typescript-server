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
}

export default UserAPI
