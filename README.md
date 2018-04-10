User
	id
	name

Post
	id
	title
	user_id
	created_at

Likes
	like_id
	post_id
	user_id
	created_at

rails g scaffold User name:text
rails g scaffold Post title:text user_id:integer
rails g scaffold Like post_id:integer user_id:integer


Query
Collection vs Connection
Authentication
Authorization
Pagination
