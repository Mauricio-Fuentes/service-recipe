// main.spec.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

describe('bootstrap', () => {
  const listenMock = jest.fn();
  const getUrlMock = jest.fn().mockResolvedValue('http://localhost:3000');

  beforeEach(() => {
    (NestFactory.create as jest.Mock).mockResolvedValue({
      listen: listenMock,
      getUrl: getUrlMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the app and start listening', async () => {
    // Importamos la función bootstrap después de hacer los mocks
    const { default: bootstrapFn } = await import('./main');

    await bootstrapFn();

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(listenMock).toHaveBeenCalledWith(3000, '0.0.0.0');
    expect(getUrlMock).toHaveBeenCalled();
  });
});