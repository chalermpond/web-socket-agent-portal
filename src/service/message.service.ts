import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'
import {
    Client,
    Server,
} from 'socket.io'
import { ProviderName } from '../provider/name'
import { Inject } from '@nestjs/common'
import { AppService } from './app.service'

const {
    AppServiceProvider,
} = ProviderName

@WebSocketGateway()
export class MessageService {
    @WebSocketServer()
    server: Server

    constructor(
        @Inject(AppServiceProvider)
        private readonly _appService: AppService,
    ) {
    }

    /**
     * Client connected event
     * @param client
     */
    public handleConnection(client: Client) {
        console.log('client connected')
        console.log(client.request.connection.remoteAddress)
    }

    /**
     * Relay broadcast message to every clients
     * @param client
     * @param data
     */
    @SubscribeMessage('broadcast')
    broadcast(client: Client, data: { text: string, sender: string }) {
        console.log('relay message', data)
        // broadcasting message
        this.server.sockets.emit('broadcast', data)

        // storing message data into db via Service
        return this._appService.saveBroadcastMessage(data.text, data.sender)
    }
}
