import { Provider } from '@nestjs/common'

import { ProviderName } from '../provider/name'
import { AppService } from '../service/app.service'
import { Pool } from 'pg'

const {
    AppServiceProvider,
    PostgresConnectionProvider,
} = ProviderName

export const serviceProviders: Provider[] = [
    {
        provide: AppServiceProvider,
        useFactory: (pool: Pool) => new AppService(pool),
        inject: [PostgresConnectionProvider],
    },

]
