require 'spec_helper'

feature 'Rechercher les intervenants d\'une filliere' do

  scenario 'Verification' do
      visit $home_page
      click_on 'Se connecter'
      log_in_as 'alice', 'lapinblanc'
      click_on_link 'Formation de l\'UTT'
      click_on_link 'SM - Systèmes mécaniques'
      click_on_link 'Technologie de l\'information pour la mécanique'
      expect(page).to have_content 'Guillaume DOYEN'
      expect(page).to have_content 'Guillaume DUCELLIER'
    end
end
