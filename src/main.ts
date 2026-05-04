import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('🌻 Flowers API')
    .setDescription(
      `
## 🌻 Flowers Marketplace — API Qo'llanma

Gullar va sovg'alar marketplace API.

---

### 🗺️ API bo'limlari:

| Bo'lim | Maqsad |
|--------|--------|
| 🔓 **Auth** | Kirish va Ro'yxatdan o'tish |
| 🌻 **Flowers** | Gullar ro'yxati |
| 🛡️ **Admin** | Foydalanuvchilarni boshqarish |
| 📊 **Dashboard** | Statistika va Kabinet |
      `,
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'Authorization', in: 'header' }, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: '🌻 Flowers API Docs',
    swaggerOptions: { persistAuthorization: true },
  });

  app.enableCors();
  await app.listen(5001);
  console.log('🚀 Flowers: http://localhost:5001/api/docs');
}
bootstrap();
