import { JsBridgeExtInjected } from '@zzispp/extension-bridge-injected';
import {
  injectedProviderReceiveHandler,
  injectJsBridge,
} from '@zzispp/cross-inpage-provider-core';

import { injectWeb3Provider } from '@zzispp/inpage-providers-hub';

// - send
const bridge = (): JsBridgeExtInjected =>
  new JsBridgeExtInjected({
    receiveHandler: injectedProviderReceiveHandler,
  });
injectJsBridge(bridge);

injectWeb3Provider({ showFloatingButton: true });

console.log('VcWallet Provider Ready ', performance.now());

// FIX: Error evaluating injectedJavaScript: This is possibly due to an unsupported return type. Try adding true to the end of your injectedJavaScript string.
// eslint-disable-next-line no-void
void 0;
