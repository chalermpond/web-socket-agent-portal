import {
    Inject,
    Injectable,
} from '@nestjs/common'
import { ProviderName } from '../provider/name'
import {
    Pool,
    PoolClient,
    QueryResult,
} from 'pg'

const {
    PostgresConnectionProvider,
} = ProviderName

@Injectable()
export class AppService {

    constructor(
        @Inject(PostgresConnectionProvider)
        private readonly _pool: Pool,
    ) {
        const createSchemaSql = `
CREATE TABLE public.bc_broadcast
(
    message text COLLATE pg_catalog."default",
    sender character varying(20) COLLATE pg_catalog."default" NOT NULL,
    ts timestamp(0) without time zone NOT NULL DEFAULT now()
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.bc_broadcast
    OWNER to postgres;
    `
        //
        this._pool.connect().then((client: PoolClient) => {
            return client.query(createSchemaSql)
                .then((result: QueryResult) => {
                    client.release()
                    return result
                })
        }).catch((err: Error) => null)

    }

    /**
     * Get latest message from db for api request
     * @param limit
     */
    public getLatestMessages(limit: number = 10): Promise<any[]> {
        const sql = `
        SELECT sender,message,ts
        FROM public.bc_broadcast
        ORDER BY ts DESC
        LIMIT ${limit};`

        return this._pool.connect().then((client: PoolClient) => {
            return client.query(sql).then((result: QueryResult) => {
                client.release()
                return result.rows
            })
        }).then((rows: any[]) => {
            return rows.map(row => ({
                sender: row.sender,
                message: row.message,
                ts: new Date(row.ts).getTime(),
            }))
        })

    }

    // for internal use from Message Service
    public saveBroadcastMessage(message: string, sender: string): Promise<any> {
        const sql = `
        INSERT INTO public.bc_broadcast(message, sender)
        VALUES ($1, $2);`

        return this._pool.connect().then((client: PoolClient) => {
            return client.query(sql, [message, sender])
                .then((result: QueryResult) => {
                    client.release()
                    return result.rows
                })
        })
    }
}
