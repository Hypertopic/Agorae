require 'spec_helper'

feature 'Ajouter une UV' do
	
	$login = 'alice'
	$pass = 'lapinblanc'
	
	$titreUV = a_string()
	$responsableUV = a_string()
	
	
	scenario 'Lorsque l utilisateur est connecté' do
		visit $home_page
		click_on_link 'UV'
		click_on 'OFF'
		click_plus_sign_next_to 'Items'
		click_on 'Sans nom'
		fill_in '', :with => $titreUV
		click_on $titreUV
		click_plus_sign_next_to 'Attributs'
		fill_in 'Nom', :with => 'Responsable'
		fill_in 'Valeur', :with => $responsableUV
		click_on 'Créer'
		expect(page).to have_content($titreUV)
	end

	scenario 'Lorsque l utilisateur n est pas connecté' do
		visit $home_page
		click_on_link 'UV'
		click_on 'Se connecter'
		log_in_as $login, $pass
		click_on 'Se connecter'
		click_on 'OFF'
		click_plus_sign_next_to 'Items'
		click_on 'Sans nom'
		fill_in 'Nom', :with => $titreUV
		click_on $titreUV
		click_plus_sign_next_to 'Attributs'
		fill_in 'Nom', :with => 'Responsable'
		fill_in 'Valeur', :with => $responsableUV
		click_on 'Créer'
		expect(page).to have_content($titreUV)
	end

end
