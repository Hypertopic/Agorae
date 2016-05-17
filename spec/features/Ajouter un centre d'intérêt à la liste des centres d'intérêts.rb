require 'spec_helper'

feature 'Ajouter un thème' do

  scenario 'à un item' do
    visit '/'
    click_on 'Se connecter'
    log_in_as 'alice', 'lapinblanc'
    click_on 'ISI – Informatique et systèmes d'information'
    click_on 'IF05 – Qualité du logiciel'
    toggle_edit()
    click_on '.add.ctl' #ajouter un id à l'image (+)
    click_on 'sans nom'
    type "Annuaire participatif"
    click_on 'Thèmes'
    expect(page).to have_content('Annuaire participatif')
  end

end