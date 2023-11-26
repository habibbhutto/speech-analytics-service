select * from speeches;
-----------------------------------
SELECT 
    full_name, 
    count(full_name) as most_speeches
from speeches 
where 
    DATE_PART('Year', speech_date) = 2013
GROUP BY
    full_name
ORDER BY 
    most_speeches desc
limit 2;
-----------------------------------
SELECT 
    full_name, 
    count(full_name) filter (where topic ~ 'Security') as most_security
from speeches 
GROUP BY
    full_name
ORDER BY 
    most_security desc
limit 2;

-----------------------------------
SELECT 
    full_name, 
    sum(words) as wordiness
from speeches 
GROUP BY
    full_name
ORDER BY 
    wordiness asc 
limit 2;

-----------------------------------
SELECT most_speeches, count(most_speeches) from (
    select 
        full_name, 
        count(full_name) as most_speeches
    from speeches
    where 
    DATE_PART('Year', speech_date) = 2012
    group by full_name
    ORDER by most_speeches desc
    limit 2
) speechData
where most_speeches = 2
group by most_speeches ORDER by most_speeches desc;