import { Module } from '@nestjs/common'

import { TotpRateLimitGuard } from './guards'
import { TotpResolver } from './totp.resolver'
import { TotpService } from './totp.service'

@Module({
	providers: [TotpResolver, TotpService, TotpRateLimitGuard],
})
export class TotpModule {}
