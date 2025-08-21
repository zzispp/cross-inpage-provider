import type { ProviderAptosMartian } from '@zzispp/onekey-aptos-provider';

export type IProviderApi = ProviderAptosMartian

export interface IProviderInfo {
  uuid: string;
  name: string;
  inject?: string; // window.ethereum
}
