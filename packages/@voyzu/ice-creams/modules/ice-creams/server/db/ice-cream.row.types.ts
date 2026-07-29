import type { ActorType, Status } from "@voyzu/types/modules/core";

export interface IceCreamFlavorRow {
  id: number;
  code: string;
  name: string;
  status: Status;
}

export interface IceCreamRow {
  id: number;
  code: string;
  name: string;
  flavor_id: number;
  flavor_code: string;
  flavor_name: string;
  flavor_status: Status;
  supplier: string;
  status: Status;
  creation_date: string;
  creation_actor_type: ActorType;
  creation_user_id: string | null;
  creation_mutation_id: string | null;
  updated_date: string;
  updated_actor_type: ActorType;
  updated_user_id: string | null;
  updated_mutation_id: string | null;
}

export interface InsertIceCreamRow {
  code: string;
  name: string;
  flavor_id: number;
  supplier: string;
  creation_date?: string;
  creation_actor_type?: ActorType;
  creation_user_id?: string | null;
  creation_mutation_id?: string | null;
}

export interface UpdateIceCreamRow {
  name: string;
  flavor_id: number;
  supplier: string;
  updated_date?: string;
  updated_actor_type?: ActorType;
  updated_user_id?: string | null;
  updated_mutation_id?: string | null;
}

export interface PatchIceCreamRow {
  name?: string;
  flavor_id?: number;
  supplier?: string;
  status?: Status;
  updated_date?: string;
  updated_actor_type?: ActorType;
  updated_user_id?: string | null;
  updated_mutation_id?: string | null;
}
