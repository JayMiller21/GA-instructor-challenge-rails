class User < ActiveRecord::Base
  has_secure_password
  has_many :favorites
  # Remember to create a migration!
end
