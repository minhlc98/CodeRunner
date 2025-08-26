import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RunnerService } from './runner.service';
import RunCodeDto from './dtos/run-code.dto';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller('runner')
export class RunnerController {
  constructor(private readonly runnerService: RunnerService) {}

  @Post('run')
  async runCode(@Body() data: RunCodeDto): Promise<{ success: boolean; id?: string }> {
    return this.runnerService.createRunner(data);
  }

  @Get('status/:id')
  async getStatus(@Param('id') id: string): Promise<{ status: string; output?: string; error?: string }> {
    const runner = await this.runnerService.assertExists({ id });
    return {
      status: runner.status,
      output: runner.output,
      error: runner.error,
    };
  }

  @MessagePattern('exec_code')
  async execCode(@Payload() data: { id: string }, @Ctx() context: RmqContext): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    const { id } = data;
    console.log('Received exec_code message. Runner ID:', id);
    const runner = await this.runnerService.assertExists({ id });
    await this.runnerService.runCode({ runner });
    
    channel.ack(originalMsg);
  }
}
