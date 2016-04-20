require 'spec_helper'

feature 'Edit an item' do

  background do
    visit '/'
  end

  scenario 'Edit an ' do

    click_on 'UV'
    click_on 'EG23 – Interface homme-machine et ergonomie'
    click_on 'OFF'
    click_on 'Attributs_+'
    fill_in 'Nom', :with => 'Intervenant'
    fill_in 'Valeur', :with => 'Martin Gardner'
    click_on 'Créer'
    expect(page).to have_content 'Intervenant Martin Gardner'
  end

end
