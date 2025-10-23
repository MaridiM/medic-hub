import { Global, Module } from '@nestjs/common'

import { UrlService } from './url.service'

/**
 * Global module providing the UrlService.
 * By using @Global(), this module makes UrlService available for dependency injection
 * throughout the entire application without needing to import UrlModule everywhere.
 */
@Global()
@Module({
	providers: [UrlService],
})
export class UrlModule {}
