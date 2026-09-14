CREATE TABLE IF NOT EXISTS inventory_item_posting_profile_assignment (
    id BIGSERIAL PRIMARY KEY,
    finance_organization_id BIGINT NOT NULL,
    inventory_item_id BIGINT NOT NULL,
    item_posting_profile_id BIGINT NOT NULL,

    creation_date audit_timestamp,
    creation_actor_type actor_type,
    creation_user_id TEXT,
    creation_mutation_id UUID,
    updated_date audit_timestamp,
    updated_actor_type actor_type,
    updated_user_id TEXT,
    updated_mutation_id UUID,
    deletion_date audit_timestamp,
    deletion_actor_type actor_type,
    deletion_user_id TEXT,
    deletion_mutation_id UUID,

    CONSTRAINT fk_inventory_item_profile_assignment_company
      FOREIGN KEY (finance_organization_id) REFERENCES finance_organization(id) ON DELETE CASCADE,
    CONSTRAINT fk_inventory_item_profile_assignment_profile
      FOREIGN KEY (finance_organization_id, item_posting_profile_id)
      REFERENCES item_posting_profile(finance_organization_id, id),
    CONSTRAINT uq_inventory_item_profile_assignment_item
      UNIQUE (finance_organization_id, inventory_item_id)
);
