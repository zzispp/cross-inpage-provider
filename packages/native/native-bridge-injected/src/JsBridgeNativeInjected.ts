import { IJsBridgeMessagePayload } from '@zzispp/cross-inpage-provider-types';

import { JsBridgeBase } from '@zzispp/cross-inpage-provider-core';

class JsBridgeNativeInjected extends JsBridgeBase {
  sendAsString = true;

  isInjected = true;

  sendPayload(payload: IJsBridgeMessagePayload | string) {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(payload as string);
    }
  }
}

export { JsBridgeNativeInjected };
