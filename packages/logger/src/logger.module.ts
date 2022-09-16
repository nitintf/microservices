import { DynamicModule, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { LoggerMetadata, winstonConfigFactory } from './config.factory';

export interface LoggerModuleOptions {
  metadata: LoggerMetadata;
}

@Module({})
export class LoggerModule {
  static register(options: LoggerModuleOptions): DynamicModule {
    return WinstonModule.forRootAsync({
      useFactory: () =>
        winstonConfigFactory(
          process.env.NODE_ENV === 'production',
          options.metadata,
        ),
    });
  }
}
