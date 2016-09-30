require 'spec_helper'

feature 'AjouterAttribut' do

  given(:attribute_name) { a_string }
  given(:attribute_value) { a_string }

  scenario 'à un item' do
    visit $home_page
    click_on 'Se connecter'
    log_in_as 'alice', 'lapinblanc'
    click_on 'Rechercher par thème'
    click_on 'Nuage'
    click_on 'Innovation'
    click_on 'Sélectionner'
    page.should have_content 'ITEMS'
    click_on 'IF09 – Systèmes documentaires'
    toggle_edit
    click_plus_sign_next_to 'attribute'
    fill_in 'Nom', :with => attribute_name
    fill_in 'Valeur', :with => attribute_value
    click_on 'Créer'
    expect(page).to have_content(attribute_name)
    expect(page).to have_content(attribute_value)
  end

end
