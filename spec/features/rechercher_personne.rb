require 'spec_helper'

 feature 'Rechercher les personnes suivant leur affiliation / service / compétences / centre(s) d\'intérêt(s) (par attributs)' do

   scenario 'Scénario CIFRE' do
     visit '/'

     click_on_link 'Personnels administratifs'
     click_on_link 'mission de l\'utt'
     click_on_link 'valorisation'
     click_on_link 'CIFRE'

     expect(page).to have_content 'Delphine DUSSOLIER'
     expect(page).to have_content 'Dora DIOP'
   end

 end
