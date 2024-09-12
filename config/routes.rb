Rails.application.routes.draw do
  devise_for :users,
             path: "users",
             path_names: {
               sign_up: "sign_up",
               sign_in: "sign_in",
               sign_out: "sign_out"
             },
             controllers: {
               sessions: "users/sessions",
               registrations: "users/registrations"
             }
end
