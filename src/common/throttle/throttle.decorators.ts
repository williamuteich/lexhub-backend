import { Throttle } from '@nestjs/throttler';

export const ShortThrottle = () => Throttle({ short: { ttl: 1000, limit: 3 } });
export const MediumThrottle = () => Throttle({ medium: { ttl: 10000, limit: 30 } });
export const LongThrottle = () => Throttle({ long: { ttl: 60000, limit: 105 } });
