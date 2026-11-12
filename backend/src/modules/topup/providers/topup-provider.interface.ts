export interface VerifyPlayerParams {
  gameTitle: string;
  playerId: string;
  zoneId?: string | null;
  serverRegion?: string | null;
}

export interface VerifyPlayerResult {
  isValid: boolean;
  playerId: string;
  zoneId?: string | null;
  serverRegion?: string | null;
  nickname: string;
  message: string;
}

export interface FulfillOrderParams {
  orderNumber: string;
  gameTitle: string;
  packageId: string;
  packageName: string;
  currencyAmount: number;
  playerId: string;
  zoneId?: string | null;
  serverRegion?: string | null;
  playerNickname?: string | null;
}

export interface FulfillOrderResult {
  success: boolean;
  providerOrderId: string;
  deliveryProof: string;
  message: string;
  status: 'completed' | 'processing' | 'failed';
}

export interface ProviderBalanceResult {
  balance: number;
  currency: string;
  provider: string;
}

export interface TopUpProvider {
  readonly name: string;
  verifyPlayer(params: VerifyPlayerParams): Promise<VerifyPlayerResult>;
  fulfillOrder(params: FulfillOrderParams): Promise<FulfillOrderResult>;
  checkBalance?(): Promise<ProviderBalanceResult>;
  getProductList?(gameTitle: string): Promise<any[]>;
}
