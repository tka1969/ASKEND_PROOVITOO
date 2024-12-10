    
CREATE OR REPLACE FUNCTION askendapi.row_insert_or_update()
  RETURNS TRIGGER
  LANGUAGE plpgsql
AS
'
DECLARE
    current_datetime    timestamp without time zone;
BEGIN
    current_datetime = now() AT TIME ZONE ''UTC'';
    
    IF TG_OP = ''INSERT'' THEN
        NEW.created_at = current_datetime;
        NEW.modified_at = current_datetime;
        RETURN NEW;
    ELSIF TG_OP = ''UPDATE'' THEN
        NEW.created_by := OLD.created_by;
        NEW.created_at := OLD.created_at;
        NEW.modified_at = current_datetime;
        RETURN NEW;
    END IF;
END;
';

