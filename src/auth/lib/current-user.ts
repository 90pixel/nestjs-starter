import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  async (data, context: ExecutionContext) => {
    return context.getArgByIndex(0)['user'];
  },
);
