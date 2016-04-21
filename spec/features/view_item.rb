require 'spec_helper'

feature 'View Item' do
  scenario 'search by topic' do
    visit '/'
    click_on 'Rechercher par thème'
    in_dialog.click_on 'Nuage'
    in_dialog.click_on 'B1. Conception et développement d\'applications'
    in_dialog.click_on 'Sélectionner'
    visit '/argos/viewpoint/A0A0A0A50Z0SD5S4DSDSDS'
    expect(page).to have_content 'B1. Conception et développement'
    click_on 'LO10 – Approches orientées services (UV)'
    visit '/argos/item/A0A0A0A50Z0SD5S4DSDSDS/A0A0A0A50Z0SD5S4DSDSDS'
  end

end