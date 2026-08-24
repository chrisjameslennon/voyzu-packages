import Type from "typebox";

import { IceCreamResponseDto } from "@voyzu/ice-creams/types";

export const events = {
  iceCreamCreated: {
    description: "An ice cream was created.",
    payload: IceCreamResponseDto,
  },
  iceCreamUpdated: {
    description: "An ice cream was updated.",
    payload: IceCreamResponseDto,
  },
  iceCreamDeleted: {
    description: "An ice cream was deleted.",
    payload: IceCreamResponseDto,
  },
  iceCreamsCreated: {
    description: "Ice creams were created.",
    payload: Type.Array(IceCreamResponseDto),
  },
  iceCreamsUpdated: {
    description: "Ice creams were updated.",
    payload: Type.Array(IceCreamResponseDto),
  },
  iceCreamsDeleted: {
    description: "Ice creams were deleted.",
    payload: Type.Array(IceCreamResponseDto),
  },
  iceCreamActivated: {
    description: "An ice cream was activated.",
    payload: IceCreamResponseDto,
  },
  iceCreamDeactivated: {
    description: "An ice cream was deactivated.",
    payload: IceCreamResponseDto,
  },
  iceCreamsActivated: {
    description: "Ice creams were activated.",
    payload: Type.Array(IceCreamResponseDto),
  },
  iceCreamsDeactivated: {
    description: "Ice creams were deactivated.",
    payload: Type.Array(IceCreamResponseDto),
  },
} as const;
