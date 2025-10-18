import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { REQUEST_TOKEN_PAYLOAD } from "../common/auth-constants";

export const TokenPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): any => {
    const context = ctx.switchToHttp();
    const request: Request & { [REQUEST_TOKEN_PAYLOAD]?: any } = context.getRequest();
    return request[REQUEST_TOKEN_PAYLOAD]!;
  }
);
