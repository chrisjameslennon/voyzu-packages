import Type from "typebox";
import { StrictObject } from "@voyzu/types/api";

export const RawRequestResponseDto = StrictObject({
  request: StrictObject({
    method: Type.String(),
    url: Type.String(),
    nextUrl: StrictObject({
      origin: Type.String(),
      pathname: Type.String(),
      search: Type.String(),
    }),
    headers: Type.Record(Type.String(), Type.String()),
    cookies: Type.Array(StrictObject({
      name: Type.String(),
      value: Type.String(),
    })),
  }),
  responseBody: StrictObject({
    message: Type.String(),
    receivedAt: Type.String(),
  }),
});

export type RawRequestResponseDto = Type.Static<typeof RawRequestResponseDto>;
