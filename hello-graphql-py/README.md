## Run

```
FLASK_APP=app.py flask run
```

## Database

Migrate the db using the following command.

```
psql hello-graphql-py-dev < structure.sql
```


```
# To check db data
from models import User, create_session

session = create_session()

users = session.query(User).filter(User.id == 1)
list(users)[0].posts

for instance in session.query(User).order_by(User.id):
    print(instance.name, instance.created_at)
```


```
# To run sample queries
from graphene import Schema
import graphql_defs
from models import create_session

query = '''
    query {
      users {
        name
        created_at
      }
    }
'''

schema = Schema(query=graphql_defs.Query)
result = schema.execute(query, context_value={'session': create_session()})
result.data
```