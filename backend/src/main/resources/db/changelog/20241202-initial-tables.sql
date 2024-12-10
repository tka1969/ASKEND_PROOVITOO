CREATE TYPE row_status_enum AS enum ('A', 'I', 'D'); -- active, inactive (row creation in progress), deleted (softly)

CREATE TABLE askendapi.parameter
(
    id bigserial PRIMARY KEY,
    parameter_class varchar(50) NOT NULL,
    property varchar(50) NOT NULL,
    name varchar(255),
    description varchar(255),
    string_value_1 varchar(255),
    int_value_1 bigint DEFAULT 0,
    int_value_2 bigint DEFAULT 0,
    valid_from timestamp without time zone default (now() at time zone 'utc'),
    valid_until timestamp without time zone,
    row_status row_status_enum DEFAULT 'A' NOT NULL,
    created_by varchar(50) NOT NULL,
    created_at timestamp without time zone,
    modified_by varchar(50) NOT NULL,
    modified_at timestamp without time zone
);

CREATE TRIGGER parameter_row_insert_or_update
BEFORE INSERT OR UPDATE
ON askendapi.parameter
    FOR EACH ROW
    EXECUTE PROCEDURE askendapi.row_insert_or_update();


CREATE TYPE some_selection_enum AS enum ('SEL_1', 'SEL_2', 'SEL_3');

CREATE TABLE askendapi.filter
(
    id bigserial PRIMARY KEY,
    name varchar(255),
    some_selection some_selection_enum DEFAULT 'SEL_1' NOT NULL,
    row_status row_status_enum DEFAULT 'A' NOT NULL,
    created_by varchar(50) NOT NULL,
    created_at timestamp without time zone,
    modified_by varchar(50) NOT NULL,
    modified_at timestamp without time zone
);

CREATE TRIGGER filter_row_insert_or_update
BEFORE INSERT OR UPDATE
ON askendapi.filter
    FOR EACH ROW
    EXECUTE PROCEDURE askendapi.row_insert_or_update();


CREATE TABLE askendapi.filter_criteria
(
    id bigserial PRIMARY KEY,
    filter_id bigint references askendapi.filter (id),
    criteria_id bigint references askendapi.parameter (id),
    condition_type_id bigint references askendapi.parameter (id) NOT NULL,
    condition_value varchar(255) NOT NULL,
    row_status row_status_enum DEFAULT 'A' NOT NULL,
    created_by varchar(50) NOT NULL,
    created_at timestamp without time zone,
    modified_by varchar(50) NOT NULL,
    modified_at timestamp without time zone
);

CREATE TRIGGER filter_criteria_row_insert_or_update
BEFORE INSERT OR UPDATE
ON askendapi.filter_criteria
    FOR EACH ROW
    EXECUTE PROCEDURE askendapi.row_insert_or_update();


GRANT INSERT, UPDATE, SELECT, DELETE ON ALL TABLES IN SCHEMA askendapi TO askendapi;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA askendapi TO askendapi;

