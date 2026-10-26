import { config } from '../../../config';
import { TopUpProvider } from './topup-provider.interface';
import { mockTopUpProvider } from './mock.provider';
import { smileOneProvider } from './smileone.provider';
import { apiGamesProvider } from './apigames.provider';

export * from './topup-provider.interface';
export * from './mock.provider';
export * from './smileone.provider';
export * from './apigames.provider';

/**
 * Factory function to retrieve the configured TopUp provider
 * Defaults to MockTopUpProvider if provider is 'mock' or credentials are not yet set
 */
export function getTopUpProvider(): TopUpProvider {
  const providerType = config.topup.provider?.toLowerCase() || 'mock';

  if (providerType === 'smileone' && (config.topup.secret || config.topup.apiKey)) {
    return smileOneProvider;
  }

  if (providerType === 'apigames' && config.topup.secret) {
    return apiGamesProvider;
  }

  return mockTopUpProvider;
}
