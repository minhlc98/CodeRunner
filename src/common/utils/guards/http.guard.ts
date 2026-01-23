import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class HttpThrottlerGuard extends ThrottlerGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // only handle that context is HTTP request
    if (context.getType() !== 'http') {
      return true; // by pass queue/microservice
    }
    return super.canActivate(context);
  }
}
