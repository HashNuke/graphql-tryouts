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
from models import User, create_session

session = create_session()

for instance in session.query(User).order_by(User.id):
    print(instance.name, instance.created_at)
```
