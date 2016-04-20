require 'spec_helper'

feature 'Ajouter une UV' do
	
	scenario 'Pour un utilisateur connecté' do
		visit $home_page
		click_on_link 'UV'
		click_on 'OFF'
		click_plus_sign_next_to 'Items'
		click_on 'Sans nom'
		fill_in '', :with => 'IF05 - Qualité du logiciel'
		click_on 'IF05 - Qualité du logiciel'
		click_plus_sign_next_to 'Attributs'
		fill_in 'Nom', :with => 'Responsable'
		fill_in 'Valeur', :with => 'Aurélien Bénel'
		click_on 'Créer'
	end

	scenario 'Pour un utilisateur non connecté' do
		visit $home_page
		click_on_link 'UV'
		click_on 'Se connecter'
		log_in_as 'alice', 'lapinblanc'
		click_on 'Se connecter'
		click_on 'OFF'
		click_plus_sign_next_to 'Items'
		click_on 'Sans nom'
		fill_in 'Nom', :with => 'IF05 - Qualité du logiciel'
		click_on 'IF05 - Qualité du logiciel'
		click_plus_sign_next_to 'Attributs'
		fill_in 'Nom', :with => 'Responsable'
		fill_in 'Valeur', :with => 'Aurélien Bénel'
		click_on 'Créer'
	end

end