Rails.application.routes.draw do
  resources :groups do
    collection do
      get "my", to: "groups#my"
    end
  end

  get "/current_user", to: "current_user#index"
  devise_for :users, path: "", path_names: {
    sign_in: "login",
    sign_out: "logout",
    registration: "signup"
  },
  controllers: {
    sessions: "users/sessions",
    registrations: "users/registrations"
  }
end
