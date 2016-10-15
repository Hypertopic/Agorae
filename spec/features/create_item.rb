require 'spec_helper'

feature 'Create and edit an item' do

	background do
		visit '/'
		click_on 'Se connecter'
		log_in_as 'alice', 'lapinblanc'
	end

	scenario 'Create an item' do
		click_on 'OFF'
		click_link('add ctl hide') //Classe du bouton '+'
	end

	scenario 'Edit an item' do
		click_on 'Sans nom'
		fill_in 'Sans nom', :with => 'Test_ajout_corpus'
		click_on 'Accueil' //Cliquer sur texte sans lien pour fermer champ d'édition
		expect(page).to have_content 'Test_ajout_corpus'
	end	

end
