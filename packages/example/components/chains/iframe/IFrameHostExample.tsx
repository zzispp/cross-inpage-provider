/* eslint-disable @typescript-eslint/restrict-plus-operands,@typescript-eslint/ban-ts-comment */
import React from 'react';
import { useLayoutEffect, useRef } from 'react';
import { JsBridgeIframe } from '@zzispp/cross-inpage-provider-core';
import { IJsonRpcRequest } from '@zzispp/cross-inpage-provider-types';
import { sendMethod } from './utils';
import { Button } from '../../ui/button';

declare global {
  interface Window {
    frameBridge: JsBridgeIframe;
    hostBridge: JsBridgeIframe;
  }
}

export default function IFrameHostExample() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  useLayoutEffect(() => {
    if (!iframeRef.current || !iframeRef.current?.contentWindow) {
      console.error('iframe not ready');
      return;
    }
    window.hostBridge = new JsBridgeIframe({
      remoteFrame: iframeRef.current?.contentWindow,
      remoteFrameName: 'FRAME',
      selfFrameName: 'HOST',
      channel: 'onekey-js-sdk',
      receiveHandler(payload) {
        const { method, params } = payload.data as IJsonRpcRequest;
        console.log('receiveHandler >>>>> ', { method, params });
        if (method === 'hi') {
          return 'from HOST: hahahah';
        }
        if (method === 'hello') {
          return { message: 'from HOST: okok' };
        }
        if (method === 'error') {
          throw new Error('from HOST: something is wrong');
        }
      },
    });
  }, []);
  return (
    <div className="h-full">
      <div className="flex gap-2 flex-wrap">
        {['hi', 'hello', 'error'].map((method, index) => {
          return (
            <Button
              key={method}
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                void sendMethod(
                  {
                    method,
                    params: [{ index }],
                  },
                  window.hostBridge,
                );
              }}
            >
              sendToFrame ({method})
            </Button>
          );
        })}
      </div>
      <iframe
        ref={iframeRef}
        src={'/iframe/frame'}
        className="border-2 border-gray-300 m-2 h-40 w-full"
        frameBorder={0}
      />
      <iframe src="/" className="border-2 border-gray-300 m-2 h-4/6 w-full" />
    </div>
  );
}
