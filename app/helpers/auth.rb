helpers do

  def current_user
    if session[:current_user_id] #if user_id key exists in session hash
      @current_user ||= User.find_by_id(session[:current_user_id]) # and if @current_user doesn's already have a value, then assign it the user with id = session[:current_user_id]
    end
  end

  def logged_in?
    !current_user.nil?
  end

end
