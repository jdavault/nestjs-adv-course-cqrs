import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersModule } from './users/users.module';
import { SwaggerBuilderModule } from './swagger/swagger-builder.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  SwaggerBuilderModule.createSpec(app, {
    include: [AppModule, UsersModule],
    title: 'User API',
    description: 'CQRS-based User Management API with REST and GraphQL endpoints',
    version: '1.0',
    path: 'api',
  });

  await app.listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger docs available at: ${await app.getUrl()}/api`);
  console.log(`GraphQL playground available at: ${await app.getUrl()}/graphql`);
}
bootstrap();
