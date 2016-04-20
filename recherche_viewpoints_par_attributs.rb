require 'spec_helper'

feature 'Rechercher un viewpoint par attributs' do

	given(:responsable) {a_string}
	given(:thèmes) {a_string}
	given(:viewpoint) {a_string}
	
	scenario 'Par responsable UV' do
		visit $home_page
		click_on 'Rechercher par attributs'
		click_plus_sign_next_to(corpus)
		click_on 'UV'
		click_plus_sign_next_to(Nom)
		click_on 'Responsable'
		click_plus_sign_next_to(Valeur)
		click_on(responsable)
		click_on 'Rechercher'
		expect(dialog).to have_content(viewpoint_name)
	end
	
	scenario 'Par formation UTT' do
		visit $home_page
		click_on 'Rechercher par thème'
		click_on 'formation de l\'UTT'
		click_on 'Selectionner'
		click_on(thèmes)
		expect(page).to have_content(viewpoint_name)
	end
	

end
