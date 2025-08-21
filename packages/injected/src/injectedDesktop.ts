import { JsBridgeDesktopInjected } from '@zzispp/desktop-bridge-injected';
import {
  injectedProviderReceiveHandler,
  injectJsBridge,
} from '@zzispp/cross-inpage-provider-core';

import { injectWeb3Provider } from '@zzispp/inpage-providers-hub';

const bridge = () =>
  new JsBridgeDesktopInjected({
    receiveHandler: injectedProviderReceiveHandler,
  });
injectJsBridge(bridge);

injectWeb3Provider();

// eslint-disable-next-line no-void
void 0;
