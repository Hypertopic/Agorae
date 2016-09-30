require 'spec_helper'

feature 'chercher un theme' do

  scenario 'par arborescence' do
    visit $home_page
    click_on 'Rechercher par thème'
    click_on 'Arborescence'
    click_on "Formation de l'UTT"
    click_on "Sélectionner"
    expect(page).to have_content('Thèmes')
  end


end
