require 'spec_helper'

feature 'Enrichir son profil avec une compétence / centre d intérêt existant' do

  scenario 'ajouter par le bouton plus' do
      visit $home_page
      click_on 'Se connecter'
      log_in_as 'alice', 'lapinblanc'
      click_on_link 'Etudiant'
      click_on_link 'Baptiste BAINIER'
      toggle_edit
      click_on_plus_sign_next_to 'Ressources secondaires' #Ajouter cette fonctinalite
      fill_in 'Nom : ', :with => 'Guillaume DOYEN(referent)'
      fill_in 'Adresse : ', :with => 'http://guillaume-doyen.fr'
      click_on 'Référencer'
    end
end
