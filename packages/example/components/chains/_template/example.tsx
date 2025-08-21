/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { dapps } from './dapps.config';
import ConnectButton from '../../../components/connect/ConnectButton';
import { useRef } from 'react';
import { get } from 'lodash';
import { IProviderApi, IProviderInfo } from './types';
import { ApiPayload, ApiGroup } from '../../ApiActuator';
import { useWallet } from '../../../components/connect/WalletContext';
import type { IKnownWallet } from '../../../components/connect/types';
import DappList from '../../../components/DAppList';

export default function Example() {
  const walletsRef = useRef<IProviderInfo[]>([
    {
      uuid: 'injected',
      name: 'Injected Wallet',
      inject: 'solana',
    },
    {
      uuid: 'injected-onekey',
      name: 'Injected VcWallet',
      inject: '$onekey.solana',
    },
  ]);

  const { provider } = useWallet<IProviderApi>();

  const onConnectWallet = async (selectedWallet: IKnownWallet) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const providerDetail = walletsRef.current?.find((w) => w.uuid === selectedWallet.id);
    if (!providerDetail) {
      return Promise.reject('Wallet not found');
    }

    const provider = get(window, providerDetail.inject) as IProviderApi | undefined;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-unsafe-optional-chaining
    const { publicKey } = await provider?.connect();

    return {
      provider,
      address: publicKey.toBase58(),
    };
  };

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
          title="getPublicKey"
          description="获取账户权限"
          onExecute={async (request: string) => {
            const res = await provider?.connect();
            return JSON.stringify(res);
          }}
        />
        <ApiPayload
          title="signMessage"
          description="签名消息"
          onExecute={async (request: string) => {
            const data = new TextEncoder().encode(request);
            const res = await provider?.signMessage(data, 'hex');
            return JSON.stringify(res);
          }}
        />
      </ApiGroup>

      <DappList dapps={dapps} />
    </>
  );
}
