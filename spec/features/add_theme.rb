require 'spec_helper'

feature 'Ajouter un thème' do

  scenario 'à un item' do
    visit $home_page
    click_on 'Se connecter'
    log_in_as 'alice', 'lapinblanc'
    click_on 'UV'
    click_on 'IF05 – Qualité du logiciel'
    click_on 'OFF'
    click_on 'Thèmes_+'
    click_on '> Formation de l\'UTT'
    click_on 'ISI - Informatique et systèmes d\'information'
    click_on 'sélectionner'
    expect(page).to have_content('Formation de l\'UTT > ISI - Informatique et systèmes d\'information')
  end

end