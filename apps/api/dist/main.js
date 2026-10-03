import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.enableCors();
    app.setGlobalPrefix('api');
    await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
//# sourceMappingURL=main.js.map