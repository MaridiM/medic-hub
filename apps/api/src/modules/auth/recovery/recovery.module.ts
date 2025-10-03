import { Module } from '@nestjs/common';
import { RecoveryService } from './recovery.service';
import { RecoveryResolver } from './recovery.resolver';

@Module({
  providers: [RecoveryResolver, RecoveryService],
})
export class RecoveryModule {}
