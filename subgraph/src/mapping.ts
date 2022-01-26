import { BigInt } from "@graphprotocol/graph-ts"
import {
  // nftMarket,
  // Approval,
  // ApprovalForAll,
  // Transfer,
  nft_Created,
  nft_Sale
} from "../generated/nftMarket/nftMarket"
import { nftEntity } from "../generated/schema"

export function handlenft_Created(event: nft_Created): void {
  let entity = nftEntity.load( event.params.tokenID.toHexString())
  if (entity == null) {
    entity = new nftEntity(event.params.tokenID.toHexString())
  }
  entity.tokenID = event.params.tokenID
  entity.tokenURI= event.params.tokenURI
  entity.creator= event.params.owner
  entity.currentOwner= event.params.owner
  entity.operator= event.params.operator
  entity.salePrice= event.params.price
  entity.sold= event.params.sold
  entity.save()
}

export function handlenft_Sale(event: nft_Sale): void {
  let entity = nftEntity.load(event.params.tokenID.toHexString())
  entity.tokenID = event.params.tokenID
  entity.currentOwner= event.params.newOwner
  entity.sold= event.params.sold
  entity.save()
}