import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type RequestWithUser = Express.Request & {
  user?: Record<string, unknown>;
};

export const GetUser = createParamDecorator<string | undefined>(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      return undefined;
    }

    return data ? user[data] : user;
  },
);
