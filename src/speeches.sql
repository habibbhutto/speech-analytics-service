CREATE TABLE speeches (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),

    full_name VARCHAR NOT NULL,
    topic VARCHAR NOT NULL,
    speech_date DATE NOT NULL,
    words INTEGER NOT NULL,
    
    created TIMESTAMPTZ DEFAULT NOW(),
    updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX speeches_full_name_idx ON speeches (full_name);
CREATE INDEX speeches_topic_idx ON speeches (topic);
CREATE INDEX speeches_speech_date_idx ON speeches (speech_date);

CREATE INDEX speeches_created_idx ON speeches (created);
CREATE INDEX speeches_updated_idx ON speeches (updated);

INSERT INTO speeches (full_name, topic, speech_date, words)
values('Alexander Abel', 'Education Policy', '2012-10-30', 5310),
('Bernhard Belling', 'Coal Subsidies', '2012-11-05', 1210),
('Bernhard Belling', 'Coal Subsidies', '2012-12-01', 1210),
('Caesare Collins', 'Coal Subsidies', '2012-11-06', 1119),
('Alexander Abel', 'Internal Security', '2012-12-11', 1911);