import type { IInpageProviderConfig } from '@zzispp/cross-inpage-provider-core';
import { ProviderBase } from '@zzispp/cross-inpage-provider-core';
import { IInjectedProviderNames } from '@zzispp/cross-inpage-provider-types';


class ProviderSuiBase extends ProviderBase {
  constructor(props: IInpageProviderConfig) {
    super(props);
  }

  protected providerName = IInjectedProviderNames.sui;

  request(data: unknown) {
    return this.bridgeRequest(data);
  }
}

export { ProviderSuiBase };
