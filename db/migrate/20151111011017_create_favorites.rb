class CreateFavorites < ActiveRecord::Migration
  def change
    create_table :favorites do |t|
      t.integer :user_id
      t.string :imdb_id
      t.string :title
      t.text :plot
      t.timestamps
    end
  end
end
