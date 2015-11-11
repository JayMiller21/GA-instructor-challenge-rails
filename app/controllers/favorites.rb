get '/favorites' do
  # response.header['Content-Type'] = 'application/json'
  @movies = JSON.parse(File.read('data.json'))
  erb :'favorites'
end

post '/favorites/new' do
  params = JSON.parse(request.env["rack.input"].read)
  movies = JSON.parse(File.read('data.json'))
  unless params["title"] && params["imdb_id"]
    return 'Invalid Request'
  else
    movie = { title: params["title"], imdb_id: params["imdb_id"] }
    movies[params["imdb_id"]] = movie
    File.write('data.json',JSON.pretty_generate(movies))
  end
  redirect to :"/"
end
