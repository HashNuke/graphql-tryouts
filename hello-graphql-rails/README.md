# README

```
(0...10).each do |i|
  user_id = i + 1
  user = User.create(id: user_id, name: "User ##{user_id}")
  (0...15).each do |post_id|
    post_index = post_id + 1
    user.posts.create(title: "Post ##{post_index} by #{user_id}")
  end
end

(0...10).each do |i|
  user_id = i + 1
  user = User.find_by(id: user_id)
  Post.order('id').limit(3) do |post|
    Like.create(user_id: user_id, post_id: post.id)
  end
end
```