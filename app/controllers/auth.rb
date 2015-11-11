get '/login' do
  if session[:login_error]
    @error = session[:login_error]
    session[:login_error] = nil
  end

  erb :'login_signup'
end

post '/login' do
  @user = User.find_by(name: params[:login][:name])

  if @user

    if @user.authenticate(params[:login][:password])
      session[:current_user_id] = @user.id
      redirect to :"/"
    else
      session[:login_error] = "Username and/or password are incorrect" #QUESTION: Would it be desirable to add have my errors included in the same session hash as the activerecord errors (so all errors are in one place, and I could make a partial that referred to that one place, and use the partial on every page that required errors to be shown)? And should I use an error handler (error ... do ... end)?
      redirect to :'/login'
    end

  else
    session[:login_error] = "Not a valid username"
    redirect to :'/login'
  end

end

post '/signup' do
  @user = User.create(name: params[:signup][:name], password: params[:signup][:password])
  # binding.pry
  session[:current_user_id] = @user.id
  redirect to :"/"
end

get '/logout' do
  session.clear
  redirect to :'/'
end
