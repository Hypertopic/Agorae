require 'spec_helper'

feature 'Create a viewpoint' do

  $a_viewpoint = a_string()
  
  background do
    visit'/'
    click_on 'Se connecter'
    fill_in 'Nom d\'utilisateur :', :with => 'donald'
    fill_in 'Mot de passe', :with => 'duck'
    click_on 'Se connecter'
  end
  
  feature 'for any viewpoint'
    toggle_edit()
    click_on add_button('points de vue')
    click_on 'Sans nom'
    fill_in 'textbox', :with => $a_viewpoint
    type_enter()
    toggle_edit()
    page.should have_content $a_viewpoint
  end

end