class StronaBlenderController < ApplicationController
    before_action :check_user

    def index 
        
    end

    def check_user
        @blender = current_user
        redirect_to new_user_session_path, notice: "Brak dostępu" if @blender.nil?
    end

end
