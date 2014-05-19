require 'spec_helper'

  
feature 'Attribute values should be easily modified' do
  
	scenario 'for an attribute already created' do
    visit '/'
    click_on 'Se connecter'
    fill_in 'Nom d\'utilisateur :', :with => 'donald'
    fill_in 'Mot de passe', :with => 'duck'
    click_on 'Se connecter'
		click_on 'Corpus-mesures'
		click_on 'item-phys'
    click_on 'OFF'
		click_on 'poids 3kg'
		fill_in 'Valeur', :with => '5,5kg'
		click_on 'Enregistrer'
    click_on 'ON'
    page.should have_content '5,5kg'
	end
end
	