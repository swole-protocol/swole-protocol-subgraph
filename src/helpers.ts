import { Workout } from "../generated/schema"
import { BigInt, Bytes } from "@graphprotocol/graph-ts"

export function createOrLoadWorkout(id: Bytes): Workout {
  let workout = Workout.load(id.toHexString())
  if(workout == null) {
    workout = new Workout(id.toHexString())
  }
  return workout as Workout
}