
INSERT INTO askendapi.parameter
    (parameter_class, property, name, description, int_value_1, created_by, modified_by)   
VALUES
    ('CRITERIA-TYPE', 'AMOUNT', 'Amount', 'Amount with number comparing conditions', 1, 'system', 'system'),
    ('CRITERIA-TYPE', 'TITLE',  'Title',  'Title with text comparing conditions',    2, 'system', 'system'),
    ('CRITERIA-TYPE', 'DATE',   'Date',   'Date with date comparing conditions',     3, 'system', 'system'),

    ('CRITERIA-AMOUNT', 'EQUALS',       'Equals',    'Amount is equal comparing condition', 0, 'system', 'system'),
    ('CRITERIA-AMOUNT', 'LESS',         'Less',      'Amount is less comparing condition', 0, 'system', 'system'),
    ('CRITERIA-AMOUNT', 'LESS-THAN',    'Less Than', 'Amount is less than comparing condition', 0, 'system', 'system'),
    ('CRITERIA-AMOUNT', 'GREATER',      'More',      'Amount is more comparing condition',  0, 'system', 'system'),
    ('CRITERIA-AMOUNT', 'GREATER-THAN', 'More Than', 'Amount is more than comparing condition',  0, 'system', 'system'),

    ('CRITERIA-TITLE', 'EQUALS',      'Equals',      'Title equals comparing condition', 0, 'system', 'system'),
    ('CRITERIA-TITLE', 'STARTS-WITH', 'Starts with', 'Title starts with comparing condition', 0, 'system', 'system'),
    ('CRITERIA-TITLE', 'ENDS-WITH',   'Ends with',   'Title ends with comparing condition',  0, 'system', 'system'),
    ('CRITERIA-TITLE', 'CONTAINS',    'Contains',    'Title contains comparing condition',  0, 'system', 'system'),

    ('CRITERIA-DATE', 'EQUALS', 'Equals', 'Date with equals comparing condition', 0, 'system', 'system'),
    ('CRITERIA-DATE', 'FROM',   'From',   'From date condition',  0, 'system', 'system'),
    ('CRITERIA-DATE', 'UNTIL',  'Until',  'Until date condition', 0, 'system', 'system')
;


INSERT INTO askendapi.filter
    (name, some_selection, created_by, modified_by)
VALUES
    ('Filter 1', 'SEL_1', 'system', 'system'),
    ('Filter 2', 'SEL_3', 'system', 'system')
;


INSERT INTO askendapi.filter_criteria
    (condition_value, created_by, modified_by, filter_id, criteria_id, condition_type_id)
VALUES
    ('Test 1', 'system', 'system', (select id from askendapi.filter where name='Filter 1'), (select id from askendapi.parameter where parameter_class='CRITERIA-TYPE' and property='TITLE'), (select id from askendapi.parameter where parameter_class='CRITERIA-TITLE' and property='EQUALS')),
    ('3', 'system', 'system', (select id from askendapi.filter where name='Filter 1'), (select id from askendapi.parameter where parameter_class='CRITERIA-TYPE' and property='AMOUNT'), (select id from askendapi.parameter where parameter_class='CRITERIA-AMOUNT' and property='GREATER')),
    ('12/12/2024', 'system', 'system', (select id from askendapi.filter where name='Filter 1'), (select id from askendapi.parameter where parameter_class='CRITERIA-TYPE' and property='DATE'), (select id from askendapi.parameter where parameter_class='CRITERIA-DATE' and property='FROM')),
    ('56', 'system', 'system', (select id from askendapi.filter where name='Filter 2'), (select id from askendapi.parameter where parameter_class='CRITERIA-TYPE' and property='AMOUNT'), (select id from askendapi.parameter where parameter_class='CRITERIA-AMOUNT' and property='EQUALS')),
    ('26/12/2024', 'system', 'system', (select id from askendapi.filter where name='Filter 2'), (select id from askendapi.parameter where parameter_class='CRITERIA-TYPE' and property='DATE'), (select id from askendapi.parameter where parameter_class='CRITERIA-DATE' and property='EQUALS')),
    ('Criteria', 'system', 'system', (select id from askendapi.filter where name='Filter 2'), (select id from askendapi.parameter where parameter_class='CRITERIA-TYPE' and property='TITLE'), (select id from askendapi.parameter where parameter_class='CRITERIA-TITLE' and property='STARTS-WITH'))
;

