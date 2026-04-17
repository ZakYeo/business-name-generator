import { Test } from '@nestjs/testing';
import { AppController } from '../src/app.controller';

describe('AppController', () => {
  it('returns a healthy response', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    const controller = moduleRef.get(AppController);
    const response = controller.getHealth();

    expect(response).toEqual(
      expect.objectContaining({
        status: 'ok',
        timestamp: expect.any(String),
      }),
    );
  });
});
