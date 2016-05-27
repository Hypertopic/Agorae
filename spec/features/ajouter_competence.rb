require 'spec_helper'

feature 'Enrichir son profil avec une compétence / centre d intérêt existant' do

  scenario 'ajouter par le bouton plus' do
      visit $home_page
      click_on 'Se connecter'
      log_in_as 'alice', 'lapinblanc'
      click_on_link 'Etudiant'
      click_on_link 'Baptiste BAINIER'
      toggle_edit
      click_on_plus_sign_next_to 'Themes' #Ajouter cette fonctinalite
      toggle_arborescence 'Competences'
      click_on 'Symphony'
      click_on_link 'Ajouter'
    end

    scenario 'ajouter par le bouton plus une competence inexistante' do
        visit $home_page
        click_on 'Se connecter'
        log_in_as 'alice', 'lapinblanc'
        click_on_link 'Competences'
        toggle_edit
        click_on_plus_sign_next_to 'Themes' #Ajouter cette fonctionalite
        click_on_link 'sans nom'
        type 'Nodejs'
        toggle_edit
      end
end
