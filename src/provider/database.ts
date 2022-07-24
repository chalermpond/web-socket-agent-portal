import { Provider as NestProviderInterface } from '@nestjs/common'
import * as Config from 'config'
import * as _ from 'lodash'
import {
    Pool,
    PoolClient,
} from 'pg'

import { ProviderName } from './name'

const {
    PostgresConnectionProvider,
} = ProviderName

export const databaseProviders: NestProviderInterface[] = [
    {
        provide: PostgresConnectionProvider,
        useFactory: async (): Promise<Pool> => {

            const config = Config.util.toObject()

            if (!_.get(config, 'messageDb', false)) {
                return Promise.reject('Cannot find connection')
            }

            const pool = new Pool({
                user: _.get(config, 'messageDb.user'),
                host: _.get(config, 'messageDb.servers'),
                database: _.get(config, 'messageDb.dbName'),
                password: _.get(config, 'messageDb.password'),
                port: _.get(config, 'messageDb.port'),
                max: 20,
            })

            return pool.connect()
                .then((client: PoolClient) => {
                    client.release()
                    return pool
                })
                .catch((err: Error) => {
                    throw err
                })

        },
    },
]
