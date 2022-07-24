import { Module } from '@nestjs/common'
import { AppController } from './controller/app.controller'
import { MessageModule } from './message.module'
import { AppService } from './service/app.service'
import { DatabaseModule } from './database.module'

@Module({
    imports: [MessageModule, DatabaseModule],
    controllers: [AppController],
    providers: [AppService],

})
export class AppModule {
}
