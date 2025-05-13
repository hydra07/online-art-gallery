// logger.ts
import pino from 'pino';

export const logger = pino({
	level: 'debug', //default: info
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true, // Màu sắc
			translateTime: true, // Hiển thị thời gian đẹp (ví dụ: 2024-11-18 12:30:45)
			ignore: 'pid,hostname' // Bỏ qua pid và hostname
		}
	}
});
