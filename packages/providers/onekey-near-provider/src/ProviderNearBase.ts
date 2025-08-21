import { IInjectedProviderNames, IJsonRpcRequest } from '@zzispp/cross-inpage-provider-types';

import { ProviderBase, IInpageProviderConfig } from '@zzispp/cross-inpage-provider-core';

class ProviderNearBase extends ProviderBase {
  constructor(props: IInpageProviderConfig) {
    super(props);
  }

  protected providerName = IInjectedProviderNames.near;

  request(data: unknown) {
    return this.bridgeRequest(data);
  }
}

export { ProviderNearBase };
