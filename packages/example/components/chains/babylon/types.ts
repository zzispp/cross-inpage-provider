import type { BBNProviderCosmos } from '@zzispp/onekey-cosmos-provider';

export type IProviderApi = BBNProviderCosmos

export interface IProviderInfo {
  uuid: string;
  name: string;
  inject?: string; // window.ethereum
}
