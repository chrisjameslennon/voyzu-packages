import Type from "typebox";

export const RawRequestResponseDto = Type.Object({
  request: Type.Object({
    method: Type.String(),
    url: Type.String(),
    nextUrl: Type.Object({
      origin: Type.String(),
      pathname: Type.String(),
      search: Type.String(),
    }),
    headers: Type.Record(Type.String(), Type.String()),
    cookies: Type.Array(Type.Object({
      name: Type.String(),
      value: Type.String(),
    })),
  }),
  responseBody: Type.Object({
    message: Type.String(),
    receivedAt: Type.String(),
  }),
});

export type RawRequestResponseDto = Type.Static<typeof RawRequestResponseDto>;
