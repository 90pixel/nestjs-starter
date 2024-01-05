import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UsersModule } from './users/users.module';
import { UtilsModule } from './utils/utils.module';

/**************************************************/
const envFile = process.env.NODE_ENV
  ? `./.env.${process.env.NODE_ENV}`
  : './.env';
/**************************************************/

console.log('**************************************************');
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
try {
  fs.readFileSync(envFile, 'utf8');
  dotenv.config({ path: envFile });
} catch (e) {
  console.log('ENV:', envFile, 'not found');
  //log process env variables
  console.log(
    'existing env variables: ' + JSON.stringify(process.env, null, 2),
  );
}
console.log('**************************************************');
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFile,
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE_NAME,
      synchronize: true,
      charset: 'utf8mb4',
      autoLoadEntities: true,
      keepConnectionAlive: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      //subscribers: [__dirname + '/**/*.subscriber{.ts,.js}'],
      // logging: process.env.NODE_ENV !== 'prod',
    }),

    AuthModule,
    UsersModule,
    UtilsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
