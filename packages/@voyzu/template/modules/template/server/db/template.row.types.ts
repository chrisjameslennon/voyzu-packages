import type { ActorType, Status } from "@voyzu/types/modules/core";

export interface TemplateRow {
  id: number;
  code: string;
  description: string | null;
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

export interface InsertTemplateRow {
  code: string;
  description: string | null;
  creation_date?: string;
  creation_actor_type?: ActorType;
  creation_user_id?: string | null;
  creation_mutation_id?: string | null;
}

export interface PatchTemplateRow {
  description?: string | null;
  status?: Status;
  updated_date?: string;
  updated_actor_type?: ActorType;
  updated_user_id?: string | null;
  updated_mutation_id?: string | null;
}

export interface UpdateTemplateRow extends PatchTemplateRow {
  description: string | null;
}
