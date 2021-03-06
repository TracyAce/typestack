import {
  Constructor,
  MethodDecoratorFactory,
  MetadataInspector,
} from '@loopback/context';

import { LOGGER_LEVEL, LoggingBindings } from '../logger'

export type LoggerMetadata = {
  level: LOGGER_LEVEL,
  showArgs: boolean,
  options?: { [name: string]: any }
};

/**
 * Mark a controller method as requiring logging
 *
 * @param level - The Log Level
 */
export function logger(level?: LOGGER_LEVEL, showArgs?: boolean) {
  if (level === undefined) level = LOGGER_LEVEL.DEBUG;
  if (showArgs === undefined) showArgs = true;
  return MethodDecoratorFactory.createDecorator<LoggerMetadata>(
    LoggingBindings.METADATA,
    {
      level,
      showArgs
    },
  );
}

/**
 * Fetch log level stored by `@log` decorator.
 *
 * @param controllerClass - Target controller
 * @param methodName - Target method
 */
export function getLoggerMetadata(controllerClass: Constructor<{}>, methodName: string) {
  return (
    MetadataInspector.getMethodMetadata<LoggerMetadata>(
      LoggingBindings.METADATA,
      controllerClass.prototype,
      methodName,
    )
  );
}
