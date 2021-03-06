import {
  bind,
  BindingScope,
  Component,
  config,
  ContextTags,
  LifeCycleObserver,
  inject,
} from '@loopback/core';
import { ConnectionManager, ConnectionOptions } from 'typeorm';
import path from 'path';
import { Logger } from 'winston';

import { TypeOrmBindings } from './keys';
import { LoggingBindings } from '../logger';

export type TypeOrmConfig = {
  connectionOptions: ConnectionOptions,
  entities?: string[]
}

@bind({
  tags: { [ContextTags.KEY]: TypeOrmBindings.COMPONENT },
  scope: BindingScope.SINGLETON,
})
export class TypeOrmComponent implements Component, LifeCycleObserver {
  readonly connectionManager = new ConnectionManager();

  constructor(
    @config() readonly typeOrmConfigs: TypeOrmConfig[] = [],
    @inject(LoggingBindings.LOGGER) private logger: Logger
  ) { }

  async start() {
    for (const typeOrmConfig of this.typeOrmConfigs) {
      let entities = typeOrmConfig.connectionOptions.entities;
      if (typeOrmConfig.entities !== undefined) {
        entities = typeOrmConfig.entities
          .map(value => path.resolve(__dirname, '../../', value));
      }
      let options = {
        ...typeOrmConfig.connectionOptions,
        entities: entities
      };
      const connection = this.connectionManager.create(options);
      await connection.connect();
      this.logger.info('TypeORM component has started');
    }
  }

  async stop() {
    for (const connection of this.connectionManager.connections) {
      await connection.close();
    }
  }
}
