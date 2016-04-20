require 'capybara/rspec'
require 'capybara/poltergeist'

Capybara.run_server = false
Capybara.default_driver = :poltergeist
Capybara.app_host = "http://agorae.test.hypertopic.org"

$home_page = '/'

def in_dialog()
  find('#dialog')
end

def log_in_as(login, password)
  fill_in "Nom d'utilisateur", :with => login
  fill_in 'Mot de passe', :with => password
  in_dialog.click_on 'Se connecter'
  expect(page).not_to have_content 'Connectez-vous'
end

def toggle_edit()
  find('#toggle').click
end

def click_plus_sign_next_to(list)
  find(".#{list}-list .add").click
end

def click_del_sign_next_to(text)
  find("span.editable", text: "#{text}").find(:xpath, '..').find('.del').click
end

def click_last(list)
  find("##{list} li:last-child .editable").click
end

def edit_last(list, text)
  find("##{list} li:last-child .editable").click
  find("#item li:last-child input[type='textbox']").set("#{text}")
end

def click_on_link(text)
  find('span', :text => "#{text}").click
end

def type(*keys_sequences)
  keys_sequences.each do |s|
    find('input[type=textbox]').native.send_keys s
  end
end

def a_string()
  s = ('a'..'z').to_a.shuffle[0,8].join
end
