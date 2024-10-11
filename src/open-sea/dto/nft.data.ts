export interface NftData {
  nfts: Nft[];
}

export interface Nft {
  identifier: string;
  collection: string;
  contract: string;
  token_standard: string;
  name: string;
  description: null;
  image_url: string;
  display_image_url: string;
  display_animation_url: null;
  metadata_url: string;
  opensea_url: string;
  updated_at: Date;
  is_disabled: boolean;
  is_nsfw: boolean;
}
