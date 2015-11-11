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