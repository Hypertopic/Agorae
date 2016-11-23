require 'spec_helper'

feature 'Editer un item' do

  background do
      visit '/'
      click_on 'Se connecter'
      fill_in 'Nom d\'utilisateur', :with => 'Alice'
      fill_in 'Mot de passe', :with => 'Lapinblanc'
      click_on 'Se connecter'
      click_on 'UV'
    end

  scenario 'Editer une UV' do
    click_on 'OFF'
    click_on 'IF05 – Qualité du logiciel'
    fill_in 'IF05 – Qualité du logiciel', :with => 'IF05 – Qualité d\'un super logiciel'
    click_on 'ON'
    expect(page).to have_content 'IF05 - Qualité d\'un super logiciel'
  end

end
