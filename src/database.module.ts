import { Module } from '@nestjs/common'
import { MessageService } from './service/message.service'
import { serviceProviders } from './provider/service'
import { databaseProviders } from './provider/database'

@Module({
    imports: [],
    controllers: [],
    providers: [
        ...databaseProviders,
    ],
    exports: [ ...databaseProviders ],
})
export class DatabaseModule {}
