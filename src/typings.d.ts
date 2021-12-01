/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

export interface ICategoryListResponse {
  idCount: number,
  publishedCategory: { id: number, name: string };
}
interface IAddressListResponse {
  idCount: number,
  address: { city: string, state: string };
}
