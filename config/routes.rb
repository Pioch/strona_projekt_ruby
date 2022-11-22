Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
   get 'strona_blender/index'

   devise_scope :user do
    authenticated :user do
      root 'home#index', as: :authenticated_root #jak jest zalogowany
    end
  
    unauthenticated do
      root 'devise/sessions#new', as: :unauthenticated_root #jak nie jest zalogowany
    end
  end

end
