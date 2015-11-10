get '/' do
  erb :index
end

post '/' do
  @title = params[:title].downcase.gsub(" ","+")
  if request.xhr?
    { title: @title}.to_json
  else
    redirect to :"/"
  end
end



get 'favorites' do
  response.header['Content-Type'] = 'application/json'
  File.read('data.json')
end

# get '/favorites' do
#   file = JSON.parse(File.read('data.json'))
#   unless params[:name] && params[:oid]
#     return 'Invalid Request'
#   movie = { name: params[:name], oid: params[:oid] }
#   file << movie
#   File.write('data.json',JSON.pretty_generate(file))
#   movie.to_json
# end
