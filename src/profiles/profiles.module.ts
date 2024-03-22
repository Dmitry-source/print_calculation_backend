import { Module } from '@nestjs/common';
import { RolesController, UsersController } from './profiles.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Roles, Users } from './entities/profiles.entity';
import { RolesService } from './services/roles.service';
import { UsersService } from './services/users.service';


@Module({

  imports: [
    TypeOrmModule.forFeature([
      Roles, Users,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
  ],

  controllers: [RolesController, UsersController],
  providers: [RolesService, UsersService],
  exports: [RolesService, UsersService],
})
export class ProfilesModule {}