require 'spec_helper'

feature 'Delete a viewpoint' do

  $a_vpt = a_string()
  
  background do
    visit'/'
    click_on 'Se connecter'
    fill_in 'Nom d\'utilisateur :', :with => 'donald'
    fill_in 'Mot de passe', :with => 'duck'
    click_on 'Se connecter' 
    toggle_edit()
    click_on add_button('points de vue')
    click_on 'Sans nom'
    fill_in 'textbox', :with => $a_vpt
    type_enter()
    toggle_edit()
  end
  
  feature 'for any empty viewpoint'
  toggle_edit()
  click_on garbage_button($a_vpt)
    toggle_edit()
  page.should have_content 'Points de'
      page.should_not have_content $a_vpt
  end

end