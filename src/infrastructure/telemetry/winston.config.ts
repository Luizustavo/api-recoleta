import {
  utilities as nestWinstonModuleUtilities,
  WinstonModuleOptions,
} from 'nest-winston'
import * as winston from 'winston'

export const winstonConfig: WinstonModuleOptions = {
  levels: winston.config.npm.levels,
  defaultMeta: { service: 'nest-template' },
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.metadata(),
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
    new winston.transports.File({
      level: 'debug',
      filename: 'application.log',
      dirname: 'logs',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
    }),
  ],
}
