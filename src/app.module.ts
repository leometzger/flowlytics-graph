import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {GraphQLModule} from '@nestjs/graphql';
import {FlowsModule} from './flows/flows.module'

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
    }),
    FlowsModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: AppService, 
      useClass: AppService
    },
  ],
})
export class AppModule {}
