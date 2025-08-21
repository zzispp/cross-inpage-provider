/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { dapps } from './dapps.config';
import ConnectButton from '../../../components/connect/ConnectButton';
import { useEffect, useRef } from 'react';
import { get } from 'lodash';
import { IProviderApi, IProviderInfo } from './types';
import { ApiPayload, ApiGroup } from '../../ApiActuator';
import { useWallet } from '../../../components/connect/WalletContext';
import type { IKnownWallet } from '../../../components/connect/types';
import DappList from '../../../components/DAppList';
import params from './params';
import { toast } from '../../ui/use-toast';

export default function BTCExample() {
  const walletsRef = useRef<IProviderInfo[]>([
    {
      uuid: 'injected',
      name: 'Injected Wallet',
      inject: 'webln',
    },
    {
      uuid: 'injected-onekey',
      name: 'Injected VcWallet',
      inject: '$onekey.webln',
    },
  ]);

  const { provider, setAccount, account } = useWallet<IProviderApi>();

  const onConnectWallet = async (selectedWallet: IKnownWallet) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const providerDetail = walletsRef.current?.find((w) => w.uuid === selectedWallet.id);
    if (!providerDetail) {
      return Promise.reject('Wallet not found');
    }

    const provider = get(window, providerDetail.inject) as IProviderApi | undefined;

    await provider?.enable();

    const {
      node: { pubkey, alias },
    } = await provider?.getInfo();

    return {
      provider,
      pubkey: pubkey ?? alias,
    };
  };

  useEffect(() => {
    const accountsChangedHandler = (accounts: string) => {
      console.log('webln accountsChanged', accounts);

      if (accounts.length) {
        setAccount({
          ...account,
          address: accounts,
        });
      }
    };

    provider?.on('accountsChanged', accountsChangedHandler);

    return () => {
      provider?.off('accountsChanged', accountsChangedHandler);
    };
  }, [account, provider, setAccount]);

  return (
    <>
      <ConnectButton<IProviderApi>
        fetchWallets={() => {
          return Promise.resolve(
            walletsRef.current.map((wallet) => {
              return {
                id: wallet.uuid,
                name: wallet.name,
              };
            }),
          );
        }}
        onConnect={onConnectWallet}
      />
      <ApiGroup title="Basics">
        <ApiPayload
          title="enable"
          description="连接钱包"
          onExecute={async (request: string) => {
            await provider?.enable();
            return 'success';
          }}
        />
        <ApiPayload
          title="isEnabled"
          description="（暂不支持）连接钱包"
          onExecute={async (request: string) => {
            const res = await provider?.isEnabled();
            return JSON.stringify(res);
          }}
        />

        <ApiPayload
          title="getInfo"
          description="获取 Info 信息"
          onExecute={async () => {
            const res = await provider?.getInfo();
            return JSON.stringify(res);
          }}
        />
        <ApiPayload
          title="getBalance"
          description="获取余额"
          onExecute={async () => {
            const res = await provider?.getBalance();
            return JSON.stringify(res);
          }}
        />
        <ApiPayload
          title="lnurl"
          description="lnurl"
          presupposeParams={params.lnurl}
          onExecute={async (request: string) => {
            const res = await provider?.lnurl(request);
            return JSON.stringify(res);
          }}
        />
      </ApiGroup>
      <ApiGroup title="Message">
        <ApiPayload
          title="signMessage"
          description="signMessage"
          presupposeParams={params.signMessage}
          onExecute={async (request: string) => {
            const res = await provider?.signMessage(request);
            return JSON.stringify(res);
          }}
        />

        <ApiPayload
          title="verifyMessage"
          description="verifyMessage"
          presupposeParams={params.signMessage}
          onExecute={async (request: string) => {
            const res = await provider?.signMessage(request);
            await provider?.verifyMessage(res.signature, res.message);
            return 'success';
          }}
        />
      </ApiGroup>

      <ApiGroup title="Invoice">
        <ApiPayload
          title="makeInvoice"
          description="makeInvoice"
          presupposeParams={params.makeInvoice}
          onExecute={async (request: string) => {
            const obj = JSON.parse(request);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const res = await provider?.makeInvoice(obj);
            return JSON.stringify(res);
          }}
        />
        <ApiPayload
          title="sendPayment"
          description="支付 invoice，要通过 makeInvoice 生成 invoice，复制 paymentRequest 到 request 中"
          onExecute={async (request: string) => {
            if (!request) {
              toast({
                title: '请通过 makeInvoice 生成 invoice，复制 paymentRequest 到 request 中',
              });
              return;
            }
            const res = await provider?.sendPayment(request);
            return JSON.stringify(res);
          }}
        />
        <ApiPayload
          title="sendPaymentAsync"
          description="（暂不支持）支付 invoice，要通过 makeInvoice 生成 invoice，复制 paymentRequest 到 request 中"
          onExecute={(request: string) => {
            if (!request) {
              toast({
                title: '请通过 makeInvoice 生成 invoice，复制 paymentRequest 到 request 中',
              });
              return;
            }
            provider?.sendPaymentAsync(request);
            return Promise.resolve('success');
          }}
        />
        <ApiPayload
          title="keysend"
          description="（暂不支持）keysend"
          presupposeParams={params.keysend}
          onExecute={async (request: string) => {
            const obj = JSON.parse(request);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const res = await provider?.keysend(obj);
            return JSON.stringify(res);
          }}
        />
      </ApiGroup>
      <DappList dapps={dapps} />
    </>
  );
}
