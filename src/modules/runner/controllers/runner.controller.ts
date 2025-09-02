import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RunnerService } from '../services/runner.service';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { RunCodeDto } from '../dtos/run-code.dto';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { log_error } from 'src/common/utils/helper';
import { HttpThrottlerGuard } from 'src/common/utils/guards/http.guard';

@UseGuards(HttpThrottlerGuard)
@Controller('api/runner')
export class RunnerController {
  constructor(private readonly runnerService: RunnerService) {}

  @Post('run')
  @Throttle({ default: { limit: 3, ttl: 5000 } })
  async runCode(@Body() data: RunCodeDto): Promise<{ success: boolean; id?: string }> {
    return this.runnerService.createRunner(data);
  }

  @Get('status/:id')
  @SkipThrottle()
  async getStatus(@Param('id') id: string): Promise<{ status: string | null; output: string | null; error: string | null }> {
    const result = {
      status: null,
      output: null,
      error: null,
    };

    if (id.length < 32) return result;

    try {
      const runner = await this.runnerService.assertExists({ id });
      return {
        status: runner.status,
        output: runner.output,
        error: runner.error,
      };
    }
    catch (error) {
      log_error(error);
    }

    return result;
  }

  @MessagePattern('exec_code')
  async execCode(@Payload() data: { id: string }, @Ctx() context: RmqContext): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    const { id } = data;
    const runner = await this.runnerService.assertExists({ id });
    await this.runnerService.run({ runner });
    
    channel.ack(originalMsg);
  }
}
