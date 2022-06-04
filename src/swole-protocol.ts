import { BigInt, Bytes, ipfs } from "@graphprotocol/graph-ts"
import {
  SwoleProtocol,
  Approval,
  ApprovalForAll,
  OwnershipTransferred,
  Transfer,
  WorkoutMinted
} from "../generated/SwoleProtocol/SwoleProtocol"
import { Workout } from "../generated/schema"

import {
  createOrLoadWorkout
} from "./helpers"

export function handleTransfer(event: Transfer): void {
  let id = changetype<Bytes>(event.params.tokenId)
  let workout = Workout.load(id.toHexString())
  if(workout != null) {
    let newAddr = event.transaction.from
    workout.owner = newAddr
    workout.save()
  }
}

export function handleWorkoutMinted(event: WorkoutMinted): void {
  let id = changetype<Bytes>(event.params.tokenId)
  let workout = createOrLoadWorkout(id)
  let ownerAddr = event.transaction.from
  workout.owner = ownerAddr
  workout.identifier = event.params.tokenId
  workout.uri = event.params.tokenURI

  let uri = workout.uri
  if(uri && uri.length) {
    let uriHash = uri.split("/").pop();
    if(uriHash && uriHash.substring(0,2) == 'Qm') {
      let json = ipfs.cat(uriHash)
      if(json !== null) {
        workout.ipfsJson = json.toString()
      }
    }
  }

  workout.save()
}
