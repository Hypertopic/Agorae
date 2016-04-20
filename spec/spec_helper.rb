require 'capybara/rspec'
require 'capybara/webkit'

Capybara.run_server = false
Capybara.default_driver = :webkit
Capybara.default_wait_time = 5
Capybara.app_host ='http://agorae.test.hypertopic.org/#http://agorae.test.hypertopic.org/argos/item/cd48c7fdc83cb4ab1a61f574a631d4ec/5329d9bc4c34fd2ef8ccb896004e0a0a'

$home_page = '/'

def log_in_as(login, password)
  fill_in "Nom d'utilisateur", :with => login
  fill_in 'Mot de passe', :with => password
  in_dialog.click_on 'Se connecter'
  expect(page).not_to have_content 'Connectez-vous'
end

def type(*keys_sequences)
  keys_sequences.each do |s|
    find('input[type=textbox]').native.send_keys s
  end
end

def toggle_edit()
  find('#toggle').click
end

def a_string()
  s = ('a'..'z').to_a.shuffle[0,8].join
end

def click_plus_sign_next_to(list)
  find(".#{list}-list .add").click
end

def click_last(list)
  find("##{list} li:last-child .editable").click
end
