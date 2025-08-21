import { IInjectedProviderNames } from '@zzispp/cross-inpage-provider-types';
import { ProviderBase, IInpageProviderConfig } from '@zzispp/cross-inpage-provider-core';

class ProviderWeblnBase extends ProviderBase {
  constructor(props: IInpageProviderConfig) {
    super(props);
  }

  protected readonly providerName = IInjectedProviderNames.webln;

  request(data: unknown) {
    return this.bridgeRequest(data);
  }
}

export { ProviderWeblnBase };
