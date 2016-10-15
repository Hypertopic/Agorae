require 'spec_helper'

feature 'Search by attribute' do

	background do
		visit '/'
		click_on 'Rechercher par attributs'
	end

	scenario 'Search by evaluation' do
		select 'UV', :from => 'Corpus'
		select 'Évaluation', :from => 'Nom'
		select 'Médian', :from => 'Valeur'
		click_on 'Rechercher'
		expect(page).to have_content 'NF19 – Administration et virtualisation des systèmes et des bases de données'
	end

	scenario 'Search by responsible' do
		select 'UV', :from => 'Corpus'
		select 'Responsable', :from => 'Nom'
		select 'Aurélien Bénel', :from => 'Valeur'
		click_on 'Rechercher'
		expect(page).to have_content 'IF14 – Analyse du système d'information'
		expect(page).to have_content 'IF09 – Systèmes documentaires'
		expect(page).to have_content 'IF05 – Qualité du logiciel'
		expect(page).to have_content 'ISO1 – Méthodologie(s) pour la recherche sur les systèmes socio-techniques'
	end

end
