require 'spec_helper'
 
 feature 'Rechercher par attributs et par thème' do
 
   scenario 'Pour une uv par intervenant' do
     visit '/'
     click_on 'Rechercher par attributs'
     select('UV', :from => 'Corpus :')
     select('Intervenant', :from => 'Nom :')
     select('Aurélien Bénel', :from => 'Valeur :')
     click_on 'Rechercher'
     expect(page).to have_content 'IF05 - Qualité du logiciel'
   end

   scenario 'Pour un thème' do
     visit '/'
     click_on 'Rechercher par thème'
     click_on 'Arborescence'
     click_on 'Formation de l\'UTT'
	 click_on 'Selectionner'
	 expect(page).to have_content('Thèmes')
   end
 
 end
